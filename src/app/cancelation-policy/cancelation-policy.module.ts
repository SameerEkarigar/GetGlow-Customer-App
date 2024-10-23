import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CancelationPolicyPageRoutingModule } from './cancelation-policy-routing.module';

import { CancelationPolicyPage } from './cancelation-policy.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CancelationPolicyPageRoutingModule,
    SharedModule
  ],
  declarations: [CancelationPolicyPage]
})
export class CancelationPolicyPageModule {}
