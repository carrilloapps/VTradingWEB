/**
 * Type declarations for epayco-sdk-node
 * Since the official package doesn't include TypeScript definitions
 */

declare module 'epayco-sdk-node' {
  interface EpaycoConfig {
    apiKey: string;
    privateKey: string;
    lang?: string;
    test?: boolean;
  }

  interface PaymentResponse {
    success: boolean;
    data?: {
      ref_payco?: string;
      url_payment?: string;
      [key: string]: unknown;
    };
    error?: string;
  }

  interface EpaycoInstance {
    charge: {
      create: (data: Record<string, unknown>) => Promise<PaymentResponse>;
    };
    bank: {
      create: (data: Record<string, unknown>) => Promise<PaymentResponse>;
    };
  }

  function epaycoSDK(config: EpaycoConfig): EpaycoInstance;

  export = epaycoSDK;
}
