import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectProfessionalPageRoutingModule } from './select-professional-routing.module';

import { SelectProfessionalPage } from './select-professional.page';
import { SharedModule } from '../shared/shared.module';
// import { HeaderComponentComponent } from '../myComponents/header-component/header-component.component';

@NgModule({
  declarations: [SelectProfessionalPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectProfessionalPageRoutingModule,
    SharedModule
  ],
 
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectProfessionalPageModule {}
