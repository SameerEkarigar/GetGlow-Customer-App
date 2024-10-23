import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectAddressPageRoutingModule } from './select-address-routing.module';

import { SelectAddressPage } from './select-address.page';
import { SharedModule } from "../shared/shared.module";
import { SafePipe } from '../safe.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectAddressPageRoutingModule,
    SharedModule
],
  declarations: [SelectAddressPage]
})
export class SelectAddressPageModule {}
