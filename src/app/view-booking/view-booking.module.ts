import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewBookingPageRoutingModule } from './view-booking-routing.module';

import { ViewBookingPage } from './view-booking.page';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewBookingPageRoutingModule,
    SharedModule
],
  declarations: [ViewBookingPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewBookingPageModule {}
