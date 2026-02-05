/**
 * Payment Methods Module - Index
 * Centralizes all payment method components and configurations
 */

export { default as StripePaymentMethod } from './StripePaymentMethod';
export { default as PayPalPaymentMethod } from './PayPalPaymentMethod';
export { default as BoldPaymentMethod } from './BoldPaymentMethod';
export { default as EPaycoPaymentMethod } from './ePaycoPaymentMethod';
export { default as BinancePayPaymentMethod } from './BinancePayPaymentMethod';

export type {
  PaymentMethodComponentProps,
  PaymentMethodConfig,
  PaymentPlanDetails,
  PaymentResult,
  CustomerInfo,
  CryptoPaymentConfig,
} from './types';

// Re-export for convenient access
export * from './types';
