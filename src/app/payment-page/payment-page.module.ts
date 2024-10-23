import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentPagePageRoutingModule } from './payment-page-routing.module';

import { PaymentPagePage } from './payment-page.page';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentPagePageRoutingModule,
    SharedModule
],
  declarations: [PaymentPagePage]
})
export class PaymentPagePageModule {}
