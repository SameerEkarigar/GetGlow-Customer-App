import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AbcPage } from './abc.page';

const routes: Routes = [
  {
    path: '',
    component: AbcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbcPageRoutingModule {}
