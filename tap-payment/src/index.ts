import { registerPlugin } from '@capacitor/core';
import type { TapPaymentPlugin } from './definitions';

const TapPayment = registerPlugin<TapPaymentPlugin>('TapPayment', {
  web: () => import('./web').then(m => new m.TapPaymentWeb()),
});

export * from './definitions';
export { TapPayment };



