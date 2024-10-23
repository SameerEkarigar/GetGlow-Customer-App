import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationAccessPageRoutingModule } from './location-access-routing.module';

import { LocationAccessPage } from './location-access.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationAccessPageRoutingModule
  ],
  declarations: [LocationAccessPage]
})
export class LocationAccessPageModule {}
