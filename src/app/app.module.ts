import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { HeaderComponent } from './header/header.component';
import { SharedModule } from './shared/shared.module';
import { SearchPipe } from './search.pipe';
import { IonicStorageModule } from '@ionic/storage-angular';
import { SafePipe } from './safe.pipe';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';



@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,IonicModule, IonicStorageModule.forRoot() , IonicModule.forRoot(), AppRoutingModule, SearchPipe, HttpClientModule, SharedModule ,ReactiveFormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Deeplinks],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  
}
