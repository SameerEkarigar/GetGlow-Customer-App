import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectDateTimePageRoutingModule } from './select-date-time-routing.module';

import { SelectDateTimePage } from './select-date-time.page';
import { CustomCalendarComponentComponent } from '../myComponents/custom-calendar-component/custom-calendar-component.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectDateTimePageRoutingModule,
    SharedModule
  ],
  declarations: [SelectDateTimePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectDateTimePageModule {}
