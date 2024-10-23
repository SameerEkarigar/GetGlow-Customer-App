import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyPackagesPageRoutingModule } from './my-packages-routing.module';

import { MyPackagesPage } from './my-packages.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyPackagesPageRoutingModule,
    SharedModule
  ],
  declarations: [MyPackagesPage]
})
export class MyPackagesPageModule {}
