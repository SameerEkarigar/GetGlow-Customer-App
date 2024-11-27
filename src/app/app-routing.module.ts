import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    
  },
  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'home2/:charId',
    loadChildren: () => import('./home2/home2.module').then( m => m.Home2PageModule)
  },
  {
    path: 'home3',
    loadChildren: () => import('./home3/home3.module').then( m => m.Home3PageModule)
  },
  {
    path: 'home4',
    loadChildren: () => import('./home4/home4.module').then( m => m.Home4PageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'login-otp',
    loadChildren: () => import('./login-otp/login-otp.module').then( m => m.LoginOTPPageModule)
  },
  {
    path: 'complete-login',
    loadChildren: () => import('./complete-login/complete-login.module').then( m => m.CompleteLoginPageModule)
  },
  {
    path: 'spa-ladies/:service_category/:category_name',
    loadChildren: () => import('./spa-ladies/spa-ladies.module').then( m => m.SpaLadiesPageModule)
  },
  {
    path: 'view-booking',
    loadChildren: () => import('./view-booking/view-booking.module').then( m => m.ViewBookingPageModule)
  },
  {
    path: 'select-address',
    loadChildren: () => import('./select-address/select-address.module').then( m => m.SelectAddressPageModule)
  },
  {
    path: 'payment-page',
    loadChildren: () => import('./payment-page/payment-page.module').then( m => m.PaymentPagePageModule)
  },
  {
    path: 'select-date-time',
    loadChildren: () => import('./select-date-time/select-date-time.module').then( m => m.SelectDateTimePageModule)
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./my-profile/my-profile.module').then( m => m.MyProfilePageModule)
  },
  {
    path: 'my-packages',
    loadChildren: () => import('./my-packages/my-packages.module').then( m => m.MyPackagesPageModule)
  },
  {
    path: 'terms-condition',
    loadChildren: () => import('./terms-condition/terms-condition.module').then( m => m.TermsConditionPageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then( m => m.FAQPageModule)
  },
  {
    path: 'cancelation-policy',
    loadChildren: () => import('./cancelation-policy/cancelation-policy.module').then( m => m.CancelationPolicyPageModule)
  },
  {
    path: 'thankyou',
    loadChildren: () => import('./thankyou/thankyou.module').then( m => m.ThankyouPageModule)
  },
  {
    path: 'tabs/tab1',
    loadChildren: () => import('./tab1/tab1.module').then( m => m.Tab1PageModule)
  }
  ,
  {
    path: 'tabs/tab2',
    loadChildren: () => import('./tab2/tab2.module').then( m => m.Tab2PageModule)
  }
  ,
  {
    path: 'tabs/tab3',
    loadChildren: () => import('./tab3/tab3.module').then( m => m.Tab3PageModule)
  },
  // {
  //   path: 'testing',
  //   loadChildren: () => import('./testing/testing.module').then( m => m.TestingPageModule)
  // },
  {
    path: 'abc',
    loadChildren: () => import('./abc/abc.module').then( m => m.AbcPageModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'location-access',
    loadChildren: () => import('./location-access/location-access.module').then( m => m.LocationAccessPageModule)
  },
  {
    path: 'payment-success',
    loadChildren: () => import('./payment-success/payment-success.module').then( m => m.PaymentSuccessPageModule)
  },

 
  // {
  //   path: 'payment-success',
  //   loadChildren: () => import('./payment-success/payment-success.module').then( m => m.PaymentSuccessPageModule)
  // },
  // {
  //   path: 'packages',
  //   loadChildren: () => import('./packages/packages.module').then( m => m.PackagesPageModule)
  // },
 
  // {
  //   path: 'know-more-modal',
  //   loadChildren: () => import('./know-more-modal/know-more-modal.module').then( m => m.KnowMoreModalPageModule)
  // },
  // {
  //   path: 'component',
  //   loadChildren: () => import('./component/component.module').then( m => m.ComponentPageModule)
  // }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
