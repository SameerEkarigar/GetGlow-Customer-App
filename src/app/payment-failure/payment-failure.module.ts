import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentFailurePageRoutingModule } from './payment-failure-routing.module';

import { PaymentFailurePage } from './payment-failure.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentFailurePageRoutingModule
  ],
  declarations: [PaymentFailurePage]
})
export class PaymentFailurePageModule {}
