import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectDateTimePage } from './select-date-time.page';

const routes: Routes = [
  {
    path: '',
    component: SelectDateTimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectDateTimePageRoutingModule {}
