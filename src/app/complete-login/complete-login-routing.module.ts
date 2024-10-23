import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompleteLoginPage } from './complete-login.page';

const routes: Routes = [
  {
    path: '',
    component: CompleteLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompleteLoginPageRoutingModule {}
