export interface TapPaymentPlugin {
    startPayment(options: PaymentOptions): Promise<PaymentResult>;
  }
  
  export interface PaymentOptions {
    amount: number;
    currency: string;
    customer: {
      name: string;
      email: string;
    };
  }
  
  export interface PaymentResult {
    status: string;
    message?: string;
  }

 