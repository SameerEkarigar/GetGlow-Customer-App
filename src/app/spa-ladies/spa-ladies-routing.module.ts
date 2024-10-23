import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpaLadiesPage } from './spa-ladies.page';

const routes: Routes = [
  {
    path: '',
    component: SpaLadiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpaLadiesPageRoutingModule {}
