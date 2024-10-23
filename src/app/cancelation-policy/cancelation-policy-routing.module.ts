import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CancelationPolicyPage } from './cancelation-policy.page';

const routes: Routes = [
  {
    path: '',
    component: CancelationPolicyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CancelationPolicyPageRoutingModule {}
