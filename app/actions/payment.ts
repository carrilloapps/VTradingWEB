'use server';

import { PaymentRequest, PaymentResponse, PaymentMethod } from '@/lib/vtrading-types';

/**
 * Helper function to get webhook URL for payment methods
 * Returns null in development (localhost) as most providers require HTTPS
 */
function getWebhookUrl(method: PaymentMethod, baseUrl: string): string | null {
  // Only return webhook URL if using HTTPS (production)
  if (!baseUrl.startsWith('https://')) {
    return null;
  }

  const webhookPaths: Record<PaymentMethod, string> = {
    stripe: '/api/webhooks/stripe',
    paypal: '/api/webhooks/paypal',
    bold: '/api/webhooks/bold',
    epayco: '/api/webhooks/epayco',
    binance: '/api/webhooks/binance',
  };

  return `${baseUrl}${webhookPaths[method]}`;
}

/**
 * Helper function to get base URL with fallback
 */
function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://vtrading.app')
  );
}

/**
 * Creates a payment checkout session based on the selected payment method
 */
export async function createPaymentCheckout(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    switch (request.method) {
      case 'stripe':
        return await createStripeCheckout(request);
      case 'paypal':
        return await createPaypalCheckout(request);
      case 'bold':
        return await createBoldCheckout(request);
      case 'epayco':
        return await createEpaycoCheckout(request);
      case 'binance':
        return await createBinanceCheckout(request);
      default:
        return {
          success: false,
          error: 'Método de pago no soportado',
        };
    }
  } catch (error) {
    console.error('Payment checkout error:', error);
    return {
      success: false,
      error: 'Error al procesar el pago. Por favor, intenta de nuevo.',
    };
  }
}

/**
 * Stripe Integration
 * Documentation: https://stripe.com/docs/api
 * Requires: npm install stripe
 */
async function createStripeCheckout(request: PaymentRequest): Promise<PaymentResponse> {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return {
      success: false,
      error: 'Stripe no está configurado correctamente. Falta STRIPE_SECRET_KEY.',
    };
  }

  try {
    // Import Stripe SDK
    const { default: Stripe } = await import('stripe').catch(() => {
      throw new Error('stripe package not installed');
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stripe = new (Stripe as any)(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia',
    });

    const baseUrl = getBaseUrl();
    const webhookUrl = getWebhookUrl('stripe', baseUrl);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'VTrading Premium',
              description: `Suscripción por ${request.months} ${
                request.months === 1 ? 'mes' : 'meses'
              }`,
            },
            unit_amount: Math.round(request.totalAmount * 100), // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/plan/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/plan/pagar`,
      ...(webhookUrl && {
        // Note: Stripe webhooks are configured in the Stripe Dashboard, not via API
        // This metadata helps identify the order when webhook is received
        metadata: {
          webhookUrl: webhookUrl,
        },
      }),
      metadata: {
        months: request.months.toString(),
        userId: request.userId || 'guest',
      },
    });

    return {
      success: true,
      checkoutUrl: session.url || undefined,
      orderId: session.id,
    };
  } catch (error: unknown) {
    console.error('Stripe error:', error);

    if (error instanceof Error && error.message === 'stripe package not installed') {
      return {
        success: false,
        error: 'Stripe SDK no está instalado. Ejecuta: npm install stripe',
      };
    }

    return {
      success: false,
      error: 'Error al crear sesión de pago con Stripe',
    };
  }
}

/**
 * PayPal Integration
 * Documentation: https://developer.paypal.com/docs/api/orders/v2/
 * Requires: npm install @paypal/checkout-server-sdk
 */
async function createPaypalCheckout(request: PaymentRequest): Promise<PaymentResponse> {
  const paypalClientId = process.env.PAYPAL_CLIENT_ID;
  const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const paypalMode = process.env.PAYPAL_MODE || 'sandbox'; // 'sandbox' or 'live'

  if (!paypalClientId || !paypalClientSecret) {
    return {
      success: false,
      error:
        'PayPal no está configurado correctamente. Faltan credenciales en variables de entorno.',
    };
  }

  try {
    // Get PayPal access token
    const auth = Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString('base64');
    const paypalApiUrl =
      paypalMode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    const tokenResponse = await fetch(`${paypalApiUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get PayPal access token');
    }

    const { access_token } = await tokenResponse.json();

    const appBaseUrl = getBaseUrl();
    const webhookUrl = getWebhookUrl('paypal', appBaseUrl);

    // Note: PayPal webhooks are configured in the PayPal Developer Dashboard
    // The webhook URL should be set to: https://your-domain.com/api/webhooks/paypal
    // Event types: PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.DENIED

    // Create PayPal order
    const orderResponse = await fetch(`${paypalApiUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: `VT${Date.now()}`,
            description: `VTrading Premium - ${request.months} ${
              request.months === 1 ? 'mes' : 'meses'
            }`,
            amount: {
              currency_code: 'USD',
              value: request.totalAmount.toFixed(2),
            },
            ...(webhookUrl && {
              // Store webhook URL in custom_id for reference
              custom_id: JSON.stringify({
                userId: request.userId,
                months: request.months,
                webhookUrl: webhookUrl,
              }),
            }),
          },
        ],
        application_context: {
          brand_name: 'VTrading',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${appBaseUrl}/plan/success`,
          cancel_url: `${appBaseUrl}/plan/pagar`,
        },
      }),
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to create PayPal order');
    }

    const orderData = await orderResponse.json();
    const approveLink = orderData.links?.find(
      (link: { rel: string; href: string }) => link.rel === 'approve'
    );

    return {
      success: true,
      checkoutUrl: approveLink?.href,
      orderId: orderData.id,
    };
  } catch (error: unknown) {
    console.error('PayPal error:', error);
    return {
      success: false,
      error: 'Error al crear pago con PayPal',
    };
  }
}

/**
 * Bold.co Integration (Colombia)
 * Documentation: https://developers.bold.co/pagos-en-linea/boton-de-pagos/ambiente-pruebas
 */
async function createBoldCheckout(request: PaymentRequest): Promise<PaymentResponse> {
  const boldApiKey = process.env.BOLD_API_KEY;
  const boldApiUrl = process.env.BOLD_API_URL || 'https://api.bold.co/v1';

  if (!boldApiKey) {
    return {
      success: false,
      error: 'Bold no está configurado correctamente',
    };
  }

  try {
    const baseUrl = getBaseUrl();
    const webhookUrl = getWebhookUrl('bold', baseUrl);

    // Create Bold payment order
    const response = await fetch(`${boldApiUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${boldApiKey}`,
      },
      body: JSON.stringify({
        amount: Math.round(request.totalAmount * 100), // Amount in cents
        currency: request.currency,
        description: `VTrading Premium - ${request.months} ${
          request.months === 1 ? 'mes' : 'meses'
        }`,
        redirect_url: `${baseUrl}/plan/success`,
        cancel_url: `${baseUrl}/plan/pagar`,
        ...(webhookUrl && {
          webhook_url: webhookUrl,
        }),
        metadata: {
          months: request.months,
          userId: request.userId || 'guest',
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Bold API error');
    }

    const data = await response.json();

    return {
      success: true,
      checkoutUrl: data.checkout_url || data.payment_url,
      orderId: data.id || data.order_id,
    };
  } catch (error) {
    console.error('Bold error:', error);
    return {
      success: false,
      error: 'Error al crear pago con Bold',
    };
  }
}

/**
 * ePayco Integration (Latin America)
 * Documentation: https://api.epayco.co/
 * Requires: npm install epayco-sdk-node
 */
async function createEpaycoCheckout(request: PaymentRequest): Promise<PaymentResponse> {
  const epaycoPublicKey = process.env.EPAYCO_PUBLIC_KEY;
  const epaycoPrivateKey = process.env.EPAYCO_PRIVATE_KEY;

  if (!epaycoPublicKey || !epaycoPrivateKey) {
    return {
      success: false,
      error: 'ePayco no está configurado correctamente. Faltan keys en variables de entorno.',
    };
  }

  try {
    // Import ePayco SDK
    const { default: epaycoSDK } = await import('epayco-sdk-node').catch(() => {
      throw new Error('epayco-sdk-node package not installed');
    });

    const epayco = epaycoSDK({
      apiKey: epaycoPublicKey,
      privateKey: epaycoPrivateKey,
      lang: 'ES',
      test: process.env.EPAYCO_TEST_MODE === 'true',
    });

    // Create payment link
    const baseUrl = getBaseUrl();
    const webhookUrl = getWebhookUrl('epayco', baseUrl);

    const paymentData = {
      name: 'VTrading Premium',
      description: `Suscripción por ${request.months} ${request.months === 1 ? 'mes' : 'meses'}`,
      invoice: `VT${Date.now()}`,
      currency: 'usd',
      amount: request.totalAmount.toString(),
      tax_base: '0',
      tax: '0',
      country: 'co',
      lang: 'es',
      external: 'false',
      response: `${baseUrl}/plan/success`,
      confirmation: webhookUrl || `${baseUrl}/api/webhooks/epayco`,
      extra1: request.months.toString(),
      extra2: request.userId || 'guest',
    };

    const payment = await epayco.charge.create(paymentData);

    const urlPayment = payment.data?.urlPayment as string | undefined;
    const paymentUrl = payment.data?.paymentUrl as string | undefined;
    const refPayco = payment.data?.ref_payco as string | undefined;
    const transactionId = payment.data?.transactionId as string | undefined;

    return {
      success: true,
      checkoutUrl: urlPayment || paymentUrl,
      orderId: refPayco || transactionId,
    };
  } catch (error: unknown) {
    console.error('ePayco error:', error);

    if (error instanceof Error && error.message === 'epayco-sdk-node package not installed') {
      return {
        success: false,
        error: 'ePayco SDK no está instalado. Ejecuta: npm install epayco-sdk-node',
      };
    }

    return {
      success: false,
      error: 'Error al crear pago con ePayco',
    };
  }
}

/**
 * Binance Pay Integration
 * Documentation: https://developers.binance.com/docs/binance-pay
 */
async function createBinanceCheckout(request: PaymentRequest): Promise<PaymentResponse> {
  const binanceApiKey = process.env.BINANCE_PAY_API_KEY;
  const binanceSecretKey = process.env.BINANCE_PAY_SECRET_KEY;
  // Note: Binance Pay uses the same URL for test and production
  // Test mode is controlled by using test API credentials
  const binanceApiUrl = 'https://bpay.binanceapi.com';

  if (!binanceApiKey || !binanceSecretKey) {
    return {
      success: false,
      error: 'Binance Pay no está configurado correctamente',
    };
  }

  try {
    const crypto = await import('crypto');
    const timestamp = Date.now();
    // Generate a random nonce (UUID v4 format without dashes)
    const nonce = crypto.randomUUID().replace(/-/g, '');

    const baseUrl = getBaseUrl();
    const webhookUrl = getWebhookUrl('binance', baseUrl);

    // Binance Pay only accepts crypto currencies: BUSD, USDT, MBOX
    // Convert USD amount to USDT (1:1 peg for simplicity in test mode)
    const cryptoCurrency = 'USDT';

    // Prepare order data
    const orderData = {
      env: {
        terminalType: 'WEB',
      },
      merchantTradeNo: `VT${Date.now()}`, // Only letters and digits allowed (max 32 chars)
      orderAmount: request.totalAmount,
      currency: cryptoCurrency, // Must be BUSD, USDT, or MBOX
      goods: {
        goodsType: '02', // Virtual goods
        goodsCategory: 'Z000', // Other
        referenceGoodsId: 'VT_PREMIUM',
        goodsName: 'VTrading Premium',
        goodsDetail: `Suscripción por ${request.months} ${request.months === 1 ? 'mes' : 'meses'}`,
      },
      // Specify which cryptocurrencies customer can use to pay
      ...(request.cryptoCurrency && {
        paymentCurrency: request.cryptoCurrency,
      }),
      returnUrl: `${baseUrl}/plan/success`,
      cancelUrl: `${baseUrl}/plan/pagar`,
      // Webhook URL only in production (Binance requires HTTPS public URLs)
      ...(webhookUrl && {
        webhookUrl: webhookUrl,
      }),
    };

    const payload = JSON.stringify(orderData);

    // Create signature
    const signaturePayload = `${timestamp}\n${nonce}\n${payload}\n`;
    const signature = crypto
      .createHmac('sha512', binanceSecretKey)
      .update(signaturePayload)
      .digest('hex')
      .toUpperCase();

    // Log request details for debugging
    console.log('Binance Pay request:', {
      url: `${binanceApiUrl}/binancepay/openapi/v2/order`,
      timestamp,
      nonce,
      nonceLength: nonce.length,
      apiKey: binanceApiKey.substring(0, 10) + '...',
      signatureLength: signature.length,
      payloadLength: payload.length,
    });

    // Create order
    const response = await fetch(`${binanceApiUrl}/binancepay/openapi/v2/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'BinancePay-Timestamp': timestamp.toString(),
        'BinancePay-Nonce': nonce,
        'BinancePay-Certificate-SN': binanceApiKey,
        'BinancePay-Signature': signature,
      },
      body: payload,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Binance Pay API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries()),
      });
      throw new Error(
        `Binance Pay API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log('Binance Pay response:', data);

    if (data.status !== 'SUCCESS') {
      throw new Error(data.errorMessage || 'Binance Pay error');
    }

    return {
      success: true,
      checkoutUrl: data.data?.checkoutUrl || data.data?.universalUrl,
      orderId: data.data?.prepayId,
    };
  } catch (error) {
    console.error('Binance Pay error:', error);
    return {
      success: false,
      error: 'Error al crear pago con Binance Pay',
    };
  }
}

/**
 * Verify payment status (can be called from webhook handlers)
 * TODO: Implement verification for each payment provider
 */
export async function verifyPaymentStatus(
  method: PaymentMethod,
  orderId: string
): Promise<{ success: boolean; status: string }> {
  // Implementation depends on each payment provider's verification API
  // This is a placeholder for the actual implementation
  console.log(`Verifying payment status for ${method} - Order: ${orderId}`);
  return {
    success: true,
    status: 'pending',
  };
}
