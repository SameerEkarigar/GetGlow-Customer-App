import { ThankyouPage } from './../thankyou/thankyou.page';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.page.html',
  styleUrls: ['./payment-page.page.scss'],
})

export class PaymentPagePage implements OnInit {

  CartList: any[] = [];
  Address: any;
  Title: any;
  formattedDate: any;
  selectedTime: any;
  overalltotal: any;

  selectedPaymentMethod: string = 'creditCard';
  pay_byCard = false;
  addCashPaymentCharges = false;
  paybtn: boolean = false;
  creditPay: boolean = false;
  selectCashPay: boolean = false;
  selectedaddressOption: any;
  selectedDiscountCode: any;
  selectedDiscountAmount: any;
  AmountAfterDeductDiscount: any;
  finalAmount: any;
  
  // selectedDate: any;
  // user_index_id: any;
  // service_employee: any;
  // ServiceLocation: any;
  // service_category: any[] = [];
  // variant_id: any;
  // service_name: any;
  // employee_id: any;
  // selectedLocationUrl: any;

  constructor(private apiService: ApiService, private router: Router, private storage: Storage) { 
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  async ngOnInit() {
    this.selectedDiscountCode = await this.storage.get('selectedDiscountCode');
    this.selectedDiscountAmount = await this.storage.get('selectedDiscountAmount');
    this.AmountAfterDeductDiscount = await this.storage.get('AmountAfterDeductDiscount');
    this.PrintCartData();
    this.GetAllLocalData();
    // this.CashPayBook();
  }

  async PrintCartData(){
    var cart_data_list = JSON.parse(localStorage.getItem('cart') || '[]');
    this.CartList = cart_data_list;
    this.selectedaddressOption = await this.storage.get('selectedaddressOption');
    if (this.selectedaddressOption) {
      this.Title = await this.storage.get('selectedAddressTitle');
      this.Address = await this.storage.get('selectedAddress');
    }

    this.formattedDate = await this.storage.get('formattedDate'); 
    this.selectedTime = await this.storage.get('servicetime');
    this.overalltotal  = localStorage.getItem('overallTotalAmount');
  }

  // Initial_cart_list(){
  //   var cart_data_list = JSON.parse(localStorage.getItem('cart') || '[]');
  //   // Extract the 'id' from each item and store it in an array
  //   const cartDetails = cart_data_list.map((item: any) => {
  //     return { id: item.id, name: item.name };
  //   });
  //   const firstId = cartDetails.length > 0 ? cartDetails[0].id : null;
  //   const firstName = cartDetails.length > 0 ? cartDetails[0].name : null;
  
  //   // Store in class variables if needed
  //   this.variant_id = firstId;  // First id
  //   this.service_name = firstName;  // First service name
  
  //   console.log('First ID:', firstId);  // This will output the first id
  //   console.log('First Service Name:', firstName);
 
  // }

  checkbox1() {
    this.paybtn = true;
    this.checkbox1();
  }

  checkbox2() {
    this.paybtn = false;
  }

  visiblePay() {
    this.pay_byCard = true;
    this.addCashPaymentCharges = false;
    this.creditPay = false;
    this.selectCashPay = false;
  }

  cashPay() {
    this.pay_byCard = false;
    this.addCashPaymentCharges = true;
    this.creditPay = true;
    this.selectCashPay = true;
    this.finalAmount = this.AmountAfterDeductDiscount+ 20;
  }

  navigateToSelectdatetime() {
    this.router.navigate(['/select-date-time']);
  }

  payByCard() {
    this.creditPay = false;
  }

  async GetAllLocalData(){
    
    
    
    
    // this.employee_id = await this.storage.get('EmployeeID');
    
    // this.pay_byCard = true;
    
    
  }
  navigateTothankyou() {
    this.router.navigate(['/thankyou']);
  
    setTimeout(() => {
      this.router.navigate(['/tabs/tab1']); 
    }, 3000); 
  }
  async CashPayBook(){
    const customer_id = await this.storage.get('user_index_id');
    const selectedLocationUrl = await this.storage.get('selectedLocationUrl');
    const selectedDate = await this.storage.get('servicedate');
    const servicetime = this.selectedTime;
    const service_category = await this.storage.get('service_category');
    const service_employee = await this.storage.get('selectedEmployee');
    const service_location =  await this.storage.get('ServiceLocation'); 
    const booking_zone_id = 0;
    const status = 0;
    const booking_comment = 'Testing';

    var CartList = JSON.parse(localStorage.getItem('cart') || '[]');

    const updatedCartDataList = CartList.map((item: any) => {
      return {
        customer_id: customer_id,
        location_url: selectedLocationUrl,
        servicedate: selectedDate,
        servicetime: servicetime,
        service_category: service_category,
        service_name: item.name,
        service_employee: service_employee,
        service_location: service_location,
        booking_zone_id: booking_zone_id,
        status: status,
        service_variant: item.services_variants_id,
        variant_id: item.id,
        booking_comment: booking_comment
        // quantity: item.quantity,  
        // price: item.totalAmount,  
        // timeDuration: item.duration,  
        // serviceType: 'Massage Service',  
      };
    });

    this.apiService.insertAllBookingData({service_data: updatedCartDataList}).subscribe((response)=>{
      if(response.status === true){
        console.log('api response:',response);
        localStorage.setItem('headerCart', '');
        localStorage.setItem('cart', ''); 
        localStorage.setItem('overallTotalAmount', '');
        // setTimeout(() => {
          this.navigateTothankyou();
        // }, 1500);
        // this.navigateTothankyou();
      }
    });

    // console.log('Updated Cart : ',updatedCartDataList);




    // const customer_id = this.user_index_id;
    // const location_url = this.selectedLocationUrl;
    // const servicedate = this.selectedDate;
    // const servicetime = this.selectedTime;
    // const service_category = this.service_category;
    // const service_name = this.service_name;
    // const service_employee = this.employee_id;
    // const service_location = this.ServiceLocation;
    // const booking_zone_id = 0;
    // const status = 0;
    // const booking_comment = 'Testing';
    // const service_variant = this.variant_id;
    // console.log('service cat array',service_category);
    // this.apiService.insertAllBookingData(customer_id,location_url,servicedate,servicetime, service_category,service_name,service_employee,service_location,booking_zone_id,status,booking_comment,service_variant).subscribe((response)=>{
    //   if(response){
    //     console.log(response);
    //   }
    // })
  }
}
