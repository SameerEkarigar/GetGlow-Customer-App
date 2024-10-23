import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CompleteLoginPageRoutingModule } from './complete-login-routing.module';

import { CompleteLoginPage } from './complete-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompleteLoginPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CompleteLoginPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class CompleteLoginPageModule {}
