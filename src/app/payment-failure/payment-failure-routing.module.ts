import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentFailurePage } from './payment-failure.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentFailurePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentFailurePageRoutingModule {}
