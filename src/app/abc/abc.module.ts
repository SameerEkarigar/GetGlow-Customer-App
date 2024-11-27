import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AbcPageRoutingModule } from './abc-routing.module';

import { AbcPage } from './abc.page';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AbcPageRoutingModule,
    IonicModule.forRoot(),
    SharedModule
],
  declarations: [AbcPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbcPageModule {}
