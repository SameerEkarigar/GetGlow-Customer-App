import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginOTPPageRoutingModule } from './login-otp-routing.module';

import { LoginOTPPage } from './login-otp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginOTPPageRoutingModule,
    
  ],
  declarations: [LoginOTPPage]
})
export class LoginOTPPageModule {}
