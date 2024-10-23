import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationAccessPage } from './location-access.page';

const routes: Routes = [
  {
    path: '',
    component: LocationAccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationAccessPageRoutingModule {}
