import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { SpaLadiesPageRoutingModule } from './spa-ladies-routing.module';

import { SpaLadiesPage } from './spa-ladies.page';

import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpaLadiesPageRoutingModule,SharedModule,
    SharedModule
  ],
  declarations: [SpaLadiesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SpaLadiesPageModule {}
