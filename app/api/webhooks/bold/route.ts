import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { logger } from '@/lib/logger';

/**
 * Bold Payment Webhook Handler
 * Documentation: https://developers.bold.co/pagos-en-linea/api-link-de-pagos/webhooks
 *
 * Bold sends notifications when payment status changes
 * Important: Must return 200 OK immediately, then process asynchronously
 */
export async function POST(request: NextRequest) {
  try {
    // Parse webhook payload
    const payload = await request.json();

    logger.info('Bold webhook received', {
      status: payload.status,
      reference: payload.reference,
      transactionId: payload.transaction_id,
    });

    // Validate webhook payload
    if (!payload.reference || !payload.status) {
      logger.error('Invalid Bold webhook payload', null, { payload });
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Extract order information
    const orderId = payload.reference; // Should match VT-{timestamp}
    const paymentStatus = payload.status; // SUCCESSFUL, FAILED, PENDING, etc.
    const transactionId = payload.transaction_id;
    const amount = payload.amount?.total_amount || 0;
    const currency = payload.amount?.currency || 'USD';

    // Parse metadata from reference if needed (format: VT-{timestamp})
    // Or extract from payload if Bold includes custom metadata
    let userId = 'guest';
    let months = 1;

    // Try to get userId and months from database using orderId
    try {
      const orderDoc = await adminDb.collection('orders').doc(orderId).get();
      if (orderDoc.exists) {
        const orderData = orderDoc.data();
        userId = orderData?.userId || 'guest';
        months = orderData?.months || 1;
      }
    } catch (error) {
      logger.error('Error fetching order data in Bold webhook', error, { orderId });
    }

    // Process payment based on status
    if (paymentStatus === 'SUCCESSFUL' || paymentStatus === 'APPROVED') {
      // Payment successful - activate premium subscription

      if (userId && userId !== 'guest') {
        try {
          // Calculate premium expiration date
          const now = new Date();
          const premiumUntil = new Date(now);
          premiumUntil.setMonth(premiumUntil.getMonth() + months);

          // Update user premium status in Firestore
          const userRef = adminDb.collection('users').doc(userId);
          await userRef.update({
            premiumActive: true,
            premiumUntil: premiumUntil.toISOString(),
            lastPaymentDate: now.toISOString(),
            lastPaymentMethod: 'bold',
            lastPaymentAmount: amount,
            lastPaymentCurrency: currency,
            lastTransactionId: transactionId,
            updatedAt: now.toISOString(),
          });

          logger.info('Bold premium activated for user', {
            userId,
            months,
            premiumUntil: premiumUntil.toISOString(),
            transactionId,
          });
        } catch (error) {
          logger.error('Error updating user premium status in Bold webhook', error, {
            userId,
            orderId,
          });
          // Don't return error - payment was successful even if DB update failed
        }
      }

      // Store transaction record
      try {
        await adminDb.collection('transactions').add({
          orderId,
          userId: userId,
          gateway: 'bold',
          status: 'completed',
          amount: amount,
          currency,
          transactionId,
          months,
          createdAt: new Date().toISOString(),
          webhookPayload: payload,
        });
      } catch (error) {
        logger.error('Error storing transaction record in Bold webhook', error, { orderId });
      }
    } else if (paymentStatus === 'FAILED' || paymentStatus === 'REJECTED') {
      // Payment failed
      logger.warn('Bold payment failed', {
        orderId,
        transactionId,
        status: paymentStatus,
      });

      // Store failed transaction
      try {
        await adminDb.collection('transactions').add({
          orderId,
          userId: userId,
          gateway: 'bold',
          status: 'failed',
          amount: amount,
          currency,
          transactionId,
          months: months,
          createdAt: new Date().toISOString(),
          webhookPayload: payload,
        });
      } catch (error) {
        logger.error('Error storing failed transaction in Bold webhook', error, { orderId });
      }
    } else if (paymentStatus === 'PENDING') {
      // Payment pending (waiting for user action)
      logger.info('Bold payment pending', {
        orderId,
        transactionId,
      });
    }

    // Always return 200 OK to acknowledge receipt
    return NextResponse.json(
      {
        received: true,
        orderId,
        status: paymentStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Bold webhook processing error', error);

    // Return 200 even on error to prevent Bold from retrying
    // (we log the error for debugging but don't want Bold to keep sending webhooks)
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
 * Handle GET requests (for webhook verification/testing)
 */
export async function GET() {
  return NextResponse.json(
    {
      webhook: 'bold',
      status: 'active',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
