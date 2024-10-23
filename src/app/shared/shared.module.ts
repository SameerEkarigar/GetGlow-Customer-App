
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponentComponent } from '../myComponents/header-component/header-component.component';
import { IonicModule } from '@ionic/angular';
import { CustomCalendarComponentComponent } from '../myComponents/custom-calendar-component/custom-calendar-component.component';
import { TabcomponentComponent } from '../myComponents/tabcomponent/tabcomponent.component';
import { QuantityModalComponentComponent } from '../myComponents/quantity-modal-component/quantity-modal-component.component';
import { BackbuttonComponent } from '../myComponents/backbutton/backbutton.component';
import { KnowMoreModalComponent } from '../myComponents/know-more-modal/know-more-modal.component';

// import { CheckLocationComponent } from '../myComponents/check-location/check-location.component';

@NgModule({
  declarations: [ HeaderComponentComponent,CustomCalendarComponentComponent,TabcomponentComponent,QuantityModalComponentComponent,BackbuttonComponent,KnowMoreModalComponent],
  imports: [
    CommonModule,IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [HeaderComponentComponent,CustomCalendarComponentComponent,TabcomponentComponent,QuantityModalComponentComponent,BackbuttonComponent,KnowMoreModalComponent]
})
export class SharedModule { }
