import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-failure',
  templateUrl: './payment-failure.page.html',
  styleUrls: ['./payment-failure.page.scss'],
})
export class PaymentFailurePage implements OnInit {
  paymentFailMessage: any;
  failResponse: any;
  failStatus: any;

  constructor( private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
    console.log('arrived on payment-failure')
    setTimeout(() => {
      this.router.navigate(['/tabs/tab1']);     
    }, 3000); // 3000 milliseconds = 3 seconds
    // this.route.queryParams.subscribe((params) => {
    //   this.failResponse = params['false_response'];
    //   this.failStatus = params['failStatus'];
    //   if(this.failResponse && this.failStatus){
    //     // console.log('false response',tap_id_with_false_response)
    //     this.failResponse = this.failResponse;
    //     // this.router.navigate(['/payment-failure']);
    //     console.log('response--',this.failResponse)
    //     setTimeout(() => {
    //       this.router.navigate(['/tabs/tab1']);     
    //     }, 2000); // 3000 milliseconds = 3 seconds
      
    //   }
    // });
  }

}
