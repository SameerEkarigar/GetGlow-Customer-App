import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { NavController, Platform } from '@ionic/angular';
import { register } from 'swiper/element';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from './services/api.service';
import { response } from 'express';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],

})
export class AppComponent {
  constructor(private platform: Platform,
    private router: Router,
    private deeplinks: Deeplinks,
    private navCtrl: NavController,
    private Storage: Storage,
    private apiService: ApiService) {

    this.init();
    this.initializeApp();
  }

  async init() {
    await this.Storage.create();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Handle deep links
      App.addListener('appUrlOpen', async (event: any) => {
        const url = event.url;
        const tapId = this.getQueryParam(url, 'tap_id');
        const Order_id = this.getQueryParam(url, 'Order_id');

        if (tapId && Order_id) {
          const tap_id = tapId;

          this.apiService.CheckPaymentStatus(tap_id, Order_id).subscribe(async (response) => {
            if (response.status === true) {
              console.log('response of the api', response)
              // this.router.navigate(['/payment-page'], {
              //   queryParams: { trigger: true }
              // });
              this.router.navigate(['/thankyou'], {
                queryParams: { tap_id: tapId }, // Pass `tap_id` as a query parameter
              });
            }
          })

          console.log('Extracted tap_id:', tapId);
        } else {
          console.log('tap_id not found in the URL');
        }
      });
    });

  }

  getQueryParam(url: string, param: string): string | null {
    const queryString = url.split('?')[1]; // Get the query string part of the URL
    if (queryString) {
      const params = new URLSearchParams(queryString);
      return params.get(param); // Return the value of the specified parameter
    }
    return null;
  }

}
