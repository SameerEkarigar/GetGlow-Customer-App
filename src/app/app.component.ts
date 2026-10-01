
// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { App } from '@capacitor/app';
// import { NavController, Platform } from '@ionic/angular';
// import { register } from 'swiper/element';
// import { Deeplinks } from '@ionic-native/deeplinks/ngx';
// import { Storage } from '@ionic/storage-angular';
// import { ApiService } from './services/api.service';
// import { response } from 'express';
// register();

// @Component({
//   selector: 'app-root',
//   templateUrl: 'app.component.html',
//   styleUrls: ['app.component.scss'],

// })
// export class AppComponent {
//   failResponse: any;
//   failStatus: any;
//   constructor(private platform: Platform,
//     private router: Router,
//     private deeplinks: Deeplinks,
//     private navCtrl: NavController,
//     private Storage: Storage,
//     private apiService: ApiService) {

//     this.init();
//     this.initializeApp();
//   }

//   async init() {
//     await this.Storage.create();
//   }

//   initializeApp() {
//     this.platform.ready().then(() => {
//       // Handle deep links
//       console.log('appintialize runs')
//       App.addListener('appUrlOpen', async (event: any) => {
        
//         const url = event.url;
//         console.log('url',url)
//         const tapId = this.getQueryParam(url, 'tap_id');
//         const Order_id = this.getQueryParam(url, 'Order_id');

//         if (tapId && Order_id) {
//           const tap_id = tapId;

//           this.apiService.CheckPaymentStatus(tap_id, Order_id).subscribe(async (response) => {
//             if (response.status === true) {
//               console.log('response of the api', response)
//               setTimeout(() => {
//                 this.router.navigate(['/payment-success'], {
//                   queryParams: { tap_id: tapId }
//                 });
//               }, 1000); // 1-second delay, adjust as needed
              
//               // this.router.navigate(['/payment-page'], {
//               //   queryParams: { tap_id: tapId }
//               // });
//               // this.router.navigate(['/thankyou'], {
//               //   queryParams: { tap_id: tapId }, // Pass `tap_id` as a query parameter
//               // });
//             } else{
//               this.failResponse = response.message;
//               this.failStatus = response.status;
//               this.router.navigate(['/payment-failure'], {
//                 queryParams: { false_response: this.failResponse, failStatus: this.failStatus }
//               });
//               console.log('response of the api', response)
//             }
//           })

//           console.log('Extracted tap_id:', tapId);
//         } else {
//           console.log('tap_id not found in the URL');
//         }
//       });
//     });

//   }

//   getQueryParam(url: string, param: string): string | null {
//     const queryString = url.split('?')[1]; // Get the query string part of the URL
//     if (queryString) {
//       const params = new URLSearchParams(queryString);
//       return params.get(param); // Return the value of the specified parameter
//     }
//     return null;
//   }

// }


import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { NavController, Platform } from '@ionic/angular';
import { register } from 'swiper/element';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from './services/api.service';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  failResponse: any;
  failStatus: any;


  constructor(
    private platform: Platform,
    private router: Router,
    private ngZone:NgZone,
    private deeplinks: Deeplinks,
    private navCtrl: NavController,
    private Storage: Storage,
    private apiService: ApiService,
    
  ) {
    this.init();
    this.initializeApp();
  }

  // Initialize Ionic Storage
  async init() {
    await this.Storage.create();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      App.addListener('appUrlOpen', async (event: any) => {
        const url = event.url;
        const tapId = this.getQueryParam(url, 'tap_id');
        const Order_id = this.getQueryParam(url, 'Order_id');
        
        if (tapId && Order_id) {
          const tap_id = tapId;
  
          this.apiService.CheckPaymentStatus(tap_id, Order_id).subscribe((response) => {
            this.ngZone.run(() => {
              console.log('response of payment gateway', response)
              if (response.status === true) {
                console.log('Payment successful:', response);
                this.navCtrl.navigateForward(['/payment-page'], {
                  queryParams: { tap_id: tapId },
                }).catch(err => {
                  console.error('Navigation error to payment-page:', err);
                  // Optionally show an alert or message to the user
                  alert('Failed to navigate to payment page. Please try again.');
                });
              }
               else if(response.status === false){
                this.failResponse = response.message;
                this.failStatus = response.status;
                this.navCtrl.navigateForward(['/payment-page'], {
                  queryParams: { false_response: this.failResponse, failStatus: this.failStatus },
                }).catch(err => {
                  console.error('Navigation error to payment-failure:', err);
                  // Optionally show an alert or message to the user
                  alert('Failed to navigate to payment failure page. Please try again.');
                });
                console.log('Payment failed:', response);
              }
            });
          });
  
          console.log('Extracted tap_id:', tapId);
        } else {
          console.log('tap_id not found in the URL');
        }
      });
    });
  }

  // Utility method to extract query parameters from the URL
  getQueryParam(url: string, param: string): string | null {
    const queryString = url.split('?')[1]; // Get the query string part of the URL
    if (queryString) {
      const params = new URLSearchParams(queryString);
      return params.get(param); // Return the value of the specified parameter
    }
    return null;
  }
}

