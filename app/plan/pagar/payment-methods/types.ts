/**
 * Common types and interfaces for payment methods
 */

import { PaymentMethod, CryptoCurrency } from '@/lib/vtrading-types';

/**
 * Payment plan details
 */
export interface PaymentPlanDetails {
  months: number;
  pricePerMonth: number;
  subtotal: number;
  discount: number;
  discountAmount: number;
  total: number;
}

/**
 * Common props for all payment method components
 */
export interface PaymentMethodComponentProps {
  planDetails: PaymentPlanDetails;
  onSuccess: (result: PaymentResult) => void;
  onError: (error: string) => void;
  loading?: boolean;
}

/**
 * Payment result interface
 */
export interface PaymentResult {
  success: boolean;
  checkoutUrl?: string;
  transactionId?: string;
  error?: string;
}

/**
 * Customer billing information
 */
export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  documentType?: 'CC' | 'NIT' | 'CE' | 'Passport' | 'VEN';
  documentNumber?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

/**
 * Payment method configuration
 */
export interface PaymentMethodConfig {
  id: PaymentMethod;
  name: string;
  description: string;
  iconPath: string;
  iconBg: string;
  color: string;
  features: string[];
  requiresCustomerInfo: boolean;
  requiredFields: (keyof CustomerInfo)[];
  component: React.ComponentType<PaymentMethodComponentProps>;
}

/**
 * Crypto-specific configuration for Binance Pay
 */
export interface CryptoPaymentConfig {
  selectedCrypto: CryptoCurrency;
  onCryptoChange: (crypto: CryptoCurrency) => void;
}
