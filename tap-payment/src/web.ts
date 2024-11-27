import { WebPlugin } from '@capacitor/core';
import type { TapPaymentPlugin, PaymentOptions, PaymentResult } from './definitions';

export class TapPaymentWeb extends WebPlugin implements TapPaymentPlugin {
  async startPayment(options: PaymentOptions): Promise<PaymentResult> {
    console.log("Web version doesn't support payment processing");
    return { status: 'unsupported' };
  }
}


