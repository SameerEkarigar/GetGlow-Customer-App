import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThankyouPageRoutingModule } from './thankyou-routing.module';

import { ThankyouPage } from './thankyou.page';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThankyouPageRoutingModule,
    SharedModule
],
  declarations: [ThankyouPage]
})
export class ThankyouPageModule {}
