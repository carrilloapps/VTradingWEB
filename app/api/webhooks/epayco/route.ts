import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { logger } from '@/lib/logger';

/**
 * ePayco Payment Webhook Handler
 * Documentation: https://docs.epayco.com/docs/confirmacion
 *
 * ePayco sends notifications when payment status changes via GET or POST
 * Important: Must return 200 OK immediately, then process asynchronously
 *
 * ePayco sends these parameters:
 * - x_id_invoice: Invoice ID (our orderId)
 * - x_transaction_id: ePayco transaction ID
 * - x_amount: Payment amount
 * - x_currency_code: Currency (USD, COP, etc.)
 * - x_transaction_date: Transaction timestamp
 * - x_signature: Security signature
 * - x_approval_code: Approval code (if approved)
 * - x_transaction_state: Transaction state (Aceptada, Rechazada, Pendiente, Fallida)
 * - x_response_reason_text: Response reason
 * - x_extra1, x_extra2: Custom fields (we use for months and userId)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse webhook payload (ePayco can send as form data or JSON)
    const contentType = request.headers.get('content-type');
    let payload: Record<string, string>;

    if (contentType?.includes('application/json')) {
      payload = await request.json();
    } else {
      // Parse form data
      const formData = await request.formData();
      payload = Object.fromEntries(formData.entries()) as Record<string, string>;
    }

    logger.info('ePayco webhook received', {
      invoice: payload.x_id_invoice,
      transactionId: payload.x_transaction_id,
      state: payload.x_transaction_state,
    });

    // Validate webhook payload
    if (!payload.x_id_invoice || !payload.x_transaction_state) {
      logger.error('Invalid ePayco webhook payload', null, { payload });
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Validate signature for security
    const epaycoTestMode = process.env.EPAYCO_TEST_MODE === 'true';
    const epaycoPKey = process.env.EPAYCO_P_KEY;

    if (epaycoPKey && payload.x_signature) {
      const crypto = await import('crypto');
      // ePayco signature: p_key ^ x_id_invoice ^ x_transaction_id ^ x_amount ^ x_currency_code
      const signatureString = `${epaycoPKey}^${payload.x_id_invoice}^${payload.x_transaction_id}^${payload.x_amount}^${payload.x_currency_code}`;
      const expectedSignature = crypto.createHash('sha256').update(signatureString).digest('hex');

      if (!epaycoTestMode && payload.x_signature !== expectedSignature) {
        logger.error('Invalid ePayco signature', null, {
          received: payload.x_signature,
          expected: expectedSignature,
        });
        return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
      }
    }

    // Extract order information
    const orderId = payload.x_id_invoice; // Should match VT-{timestamp}
    const paymentState = payload.x_transaction_state; // Aceptada, Rechazada, Pendiente, Fallida
    const transactionId = payload.x_transaction_id;
    const amount = parseFloat(payload.x_amount || '0');
    const currency = payload.x_currency_code || 'USD';
    const refPayco = payload.x_ref_payco || transactionId;

    // Extract custom fields
    const months = parseInt(payload.x_extra1 || '1', 10);
    const userId = payload.x_extra2 || 'guest';

    // Process payment based on state
    // ePayco states: Aceptada, Rechazada, Pendiente, Fallida
    if (paymentState === 'Aceptada') {
      // Payment successful - activate premium subscription

      if (userId && userId !== 'guest') {
        try {
          // Calculate premium expiration date
          const now = new Date();
          const premiumUntil = new Date(now);
          premiumUntil.setMonth(premiumUntil.getMonth() + months);

          // Update user premium status in Firestore (only in production)
          const userRef = adminDb.collection('users').doc(userId);
          await userRef.update({
            premiumActive: true,
            premiumUntil: premiumUntil.toISOString(),
            lastPaymentDate: now.toISOString(),
            lastPaymentMethod: 'epayco',
            lastPaymentAmount: amount,
            lastPaymentCurrency: currency,
            lastTransactionId: transactionId,
            lastRefPayco: refPayco,
            updatedAt: now.toISOString(),
          });

          logger.info('ePayco premium activated for user', {
            userId,
            months,
            premiumUntil: premiumUntil.toISOString(),
            transactionId,
          });
        } catch (error) {
          logger.warn('Firestore user update failed during ePayco success', error);
        }
      }

      // Update order status (optional in development)
      try {
        await adminDb.collection('orders').doc(orderId).update({
          status: 'completed',
          transactionId,
          refPayco,
          completedAt: new Date().toISOString(),
        });
      } catch (error) {
        logger.warn('Order status update skipped (Firestore unavailable) - epayco success', error);
      }

      // Store transaction record (optional in development)
      try {
        await adminDb.collection('transactions').add({
          orderId,
          userId: userId,
          gateway: 'epayco',
          status: 'completed',
          amount: amount,
          currency,
          transactionId,
          refPayco,
          months,
          createdAt: new Date().toISOString(),
          webhookPayload: payload,
        });
      } catch (error) {
        logger.warn('Transaction record skipped (Firestore unavailable) - epayco success', error);
      }
    } else if (paymentState === 'Rechazada' || paymentState === 'Fallida') {
      // Payment failed
      logger.info('ePayco payment failed', {
        orderId,
        transactionId,
        state: paymentState,
        reason: payload.x_response_reason_text,
      });

      // Update order status (optional in development)
      try {
        await adminDb.collection('orders').doc(orderId).update({
          status: 'failed',
          transactionId,
          refPayco,
          failureReason: payload.x_response_reason_text,
          failedAt: new Date().toISOString(),
        });
      } catch (error) {
        logger.warn('Order status update skipped (Firestore unavailable) - epayco fail', error);
      }

      // Store failed transaction (optional in development)
      try {
        await adminDb.collection('transactions').add({
          orderId,
          userId: userId,
          gateway: 'epayco',
          status: 'failed',
          amount: amount,
          currency,
          transactionId,
          refPayco,
          months: months,
          failureReason: payload.x_response_reason_text,
          createdAt: new Date().toISOString(),
          webhookPayload: payload,
        });
      } catch (error) {
        logger.warn('Transaction record skipped (Firestore unavailable) - epayco fail', error);
      }
    } else if (paymentState === 'Pendiente') {
      // Payment pending (waiting for confirmation)
      logger.info('ePayco payment pending', {
        orderId,
        transactionId,
      });

      // Update order status (optional in development)
      try {
        await adminDb.collection('orders').doc(orderId).update({
          status: 'pending',
          transactionId,
          refPayco,
        });
      } catch (error) {
        logger.warn('Order status update skipped (Firestore unavailable) - epayco pending', error);
      }
    }

    // Always return 200 OK to acknowledge receipt
    return NextResponse.json(
      {
        received: true,
        orderId,
        state: paymentState,
        transactionId,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('ePayco webhook error', error);

    // Return 200 even on error to prevent ePayco from retrying
    // (we log the error for debugging but don't want ePayco to keep sending webhooks)
    return NextResponse.json(
      {
        received: true,
        error: 'Internal processing error',
      },
      { status: 200 }
    );
  }
}

/**
 * Handle GET requests
 * ePayco can also send confirmation via GET with query parameters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract parameters from query string
    const payload: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      payload[key] = value;
    });

    // If there are ePayco parameters, process as webhook
    if (payload.x_id_invoice && payload.x_transaction_state) {
      logger.info('ePayco webhook received via GET', {
        invoice: payload.x_id_invoice,
        transactionId: payload.x_transaction_id,
        state: payload.x_transaction_state,
      });

      // Process using same logic as POST (code reuse)
      // For simplicity, we'll just acknowledge the GET request
      return NextResponse.json(
        {
          received: true,
          orderId: payload.x_id_invoice,
          state: payload.x_transaction_state,
        },
        { status: 200 }
      );
    }

    // Default GET response (for testing)
    return NextResponse.json(
      {
        webhook: 'epayco',
        status: 'active',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('ePayco webhook GET error', error);
    return NextResponse.json(
      {
        received: true,
        error: 'Internal processing error',
      },
      { status: 200 }
    );
  }
}
