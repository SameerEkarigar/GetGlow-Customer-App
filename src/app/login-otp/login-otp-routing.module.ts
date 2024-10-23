import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginOTPPage } from './login-otp.page';

const routes: Routes = [
  {
    path: '',
    component: LoginOTPPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginOTPPageRoutingModule {}
