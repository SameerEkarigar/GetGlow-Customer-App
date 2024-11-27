import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-header-component',
  templateUrl: './header-component.component.html',
  styleUrls: ['./header-component.component.scss'],
})
export class HeaderComponentComponent  implements OnInit {
  @Input() cart_quantity: any = '';

  constructor(private router: Router, private paymentService: PaymentService) { }

  ngOnInit() {
   const header_cart = localStorage.getItem('headerCart');
   this.cart_quantity = header_cart;
  //  console.log(this.cart_quantity);
  //  console.log(header_cart);
  }

  navigateToTabsTab1(){
    this.router.navigate(['/tabs/tab1']);
  }

  navigateToViewCart(){
    this.router.navigate(['/view-booking']);
  }
} 
