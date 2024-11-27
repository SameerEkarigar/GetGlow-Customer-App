import { HttpClient } from '@angular/common/http';
import { ThankyouPage } from './../thankyou/thankyou.page';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Http } from '@capacitor-community/http';
import { PaymentService } from '../services/payment.service';
import { TapPayment } from 'tap-payment/src';
import { response } from 'express';
// import { PaymentService } from '../services/payment.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.page.html',
  styleUrls: ['./payment-page.page.scss'],
})

export class PaymentPagePage implements OnInit {
  PastBookingArray: any[] = [];
  CartList: any[] = [];
  CartListforcheckPreviousPackage: any;
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
  selectCashPay: boolean = true;
  selectedaddressOption: any;
  selectedDiscountCode: any;
  selectedDiscountAmount: any;
  AmountAfterDeductDiscount: any;
  finalAmount: any;
  today: string = new Date().toISOString().slice(0, 10);
  packageStartDate: any;
  slecetDatePackage: boolean = false;
  booking_type: any;
  showAddressAndDate: boolean = true;
  showCalender: boolean = false;
  showpackageDropdown: boolean = false;
  mergedDates: any[]=[];
  allPackageDates: any[]=[];
  // PastBookingArray: any[] = [];
  allSelectedDates: any;
  consolidatedDates: any;
  resultJson: any;
  printServiceRealtedPackages: any[]=[];
  allResponses: any[]=[];
 // PastBookingArray: any[] | undefined;
  // PastBookingArray: never[];
  isChecked: boolean = false;
  selectedPackageId: any = null;
  selectedPackage: any;
  package_used: any;
  totalAmountBeforeAnyDeduction: any;
  hideDiscountRow: boolean = true;
  ifpackagethenTotalAmount: boolean = false;
  vatAmount: any;
  selected_service_amount: any;
  hideRadioButton: boolean = true;
  booking_id: any;
  booking_id_suffix: any;
  couple_booking_employee_count: any;
  people_count: any;
  connectToPaymentGateway: boolean = false;
  tapId: string | null = null;
  booking_type_payment: any;
  bookFromPackage: any[] = [];
  constructor(
    private http: HttpClient, 
    private apiService: ApiService, 
    private router: Router, 
    private storage: Storage, 
    private tap_payment: PaymentService,
    private route: ActivatedRoute
  ) { 
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  async ngOnInit() {
    var CartList = JSON.parse(localStorage.getItem('cart') || '[]');
    CartList = CartList.map((item: any) => ({
      ...item, // Retain existing properties
      BookedFromPackage: 0 // Add new variable with value 0
    }));
    
    // Save back the updated CartList to localStorage (if needed)
    localStorage.setItem('cart', JSON.stringify(CartList));
    this.route.queryParams.subscribe((params) => {
      if (params['trigger'] === 'true') {
        this.OnlinePayment(); // Trigger the function
      }
    });
   
    this.connectToPaymentGateway = false;
    
    //  console.log('check', check)
    this.visiblePay();
    const booking_type = await this.storage.get('booking_type');
    if (booking_type === 'package') {
        this.hideDiscountRow= false;
        this.finalAmount = localStorage.getItem('overallTotalAmount');
        const netAmountBeforeVAT = this.finalAmount / (1 + 5 / 100);
        const vatAmount = this.finalAmount - netAmountBeforeVAT;
        this.vatAmount = Math.round(vatAmount * 100) / 100;
    }
    const checkViewbooking = await this.storage.get('backtoViewbooking');
    // console.log(checkViewbooking)
    if (checkViewbooking === 'viewBooking') {
        this.slecetDatePackage = true;
    }
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];
    this.selectedDiscountCode = await this.storage.get('selectedDiscountCode');
    this.selectedDiscountAmount = await this.storage.get('selectedDiscountAmount');
    this.AmountAfterDeductDiscount = await this.storage.get('AmountAfterDeductDiscount');
    // console.log('this.AmountAfterDeductDiscount',this.AmountAfterDeductDiscount)
    this.PrintCartData();
    this.printPreviousBookedPackage();

    // Initialize selectedDates in CartList with today’s date if not already an array
    this.CartList.forEach(cartitem => {
        if (!Array.isArray(cartitem.selectedDates)) {
            cartitem.selectedDates = Array(cartitem.quantity).fill(this.today);
        }
    });

    // Proceed with other logic if necessary
    this.updateConsolidatedDates();
}

  async onPaymentClick() { 
    this.connectToPaymentGateway = true;
    const AmountTobePaid = this.finalAmount;
    if(this.booking_type === 'package'){
       this.booking_type_payment = '1';
    } else{
      this.booking_type_payment = '2';
    }
    const booking_type_sex = this.booking_type_payment;
    console.log(booking_type_sex)
    const user_id = await this.storage.get('user_index_id');
    
    this.tap_payment.createPayment(AmountTobePaid, '1', user_id).subscribe(
      async (response: any) => {
        // const redirectUrl = response?.transaction?.url; // Corrected field
        const redirectUrl = response?.url;
        console.log('response', response)
        await Browser.open({ url: redirectUrl});
        if (redirectUrl) {
          // Redirect the user to the Tap Payments hosted page
          window.location.href = redirectUrl;
        } else {
          console.error('No redirect URL provided in response', response);
        }
      },
      (error) => {
        console.error('Error creating payment', error);
      }
    );
  }
  async OnlinePayment(){

    console.log('fun run ')
      const tap_id = await this.storage.get('tap_id');
      console.log('tap_id',tap_id)
      this.booking_type = await this.storage.get('booking_type');
      
        if(this.booking_type === 'package'){
          this.insertPackages();
          console.log('online mode for book package') 
      } else{ 
        console.log("trying to book massage online mode")
        const customer_id = await this.storage.get('user_index_id');
        const selectedLocationUrl = await this.storage.get('selectedLocationUrl');
        const selectedDate = localStorage.getItem('ServiceDate');
        const servicetime = this.selectedTime;
        const service_category = await this.storage.get('service_category');
        const service_employee = await this.storage.get('EmployeeID');
        const service_location = await this.storage.get('ServiceLocation'); 
        const booking_zone_id = 0;
        const status = 0;
        const booking_comment = 'Testing';
        const package_id = await this.storage.get('selectedPackageId');
        const discounted_coupon = await this.storage.get('selectedDiscountCode');
        const discount_amount = await this.storage.get('selectedDiscountAmount');
        const discounted_amount = await this.storage.get('AmountAfterDeductDiscount');
    
        var CartList = JSON.parse(localStorage.getItem('cart') || '[]');
        console.log('cart-list', CartList)
        const totalAmountSum = CartList.reduce((sum: number, item: any) => sum + item.totalAmount, 0);
        console.log(this.booking_type);
        if(this.booking_type === 'Couple'){
           this.couple_booking_employee_count = 2;
           this.people_count = 2;
        }else{
          this.couple_booking_employee_count = 1;
          this.people_count = 1;
        }
     
        const updatedCartDataList = CartList.map((item: any) => {
          return {
            customer_id: customer_id,
            location_url: selectedLocationUrl,
            servicedate: selectedDate,
            servicetime: servicetime,
            service_category: service_category,
            service_name: item.services_id,
            service_employee: service_employee,
            service_location: service_location,
            booking_zone_id: booking_zone_id,
            status: status,
            service_variant: item.services_variants_id,
            variant_id: item.id,
            booking_comment: booking_comment,
            package_id: package_id,
            package_used: item.BookedFromPackage,
            actual_amount: totalAmountSum,
            discounted_coupon: discounted_coupon,
            discount_option: 0,
            discount_amount: discount_amount,
            discounted_amount: discounted_amount,
            total_price: this.finalAmount,
            package_used_count: item.BookedFromPackage,
            payment_link: this.finalAmount,
            booking_type: this.booking_type,
            // booking_type: this.booking_type,
            couple_booking_employee_count: this.couple_booking_employee_count,
            payment_cash: '',
            people_count: this.people_count,
            service_employee_2: 0,
            service_employee_3: 0,
            service_employee_4: 0
          };
          
        });
         console.log('updatedCartDataList',updatedCartDataList)
        this.apiService.insertAllBookingData({service_data: updatedCartDataList}).subscribe(async (response)=>{
          if(response.status === true){
            this.booking_id = response.booking_id;
            console.log('response of insert api',response);
            await this.storage.set('booking_id', this.booking_id);
            localStorage.setItem('headerCart', '');
            localStorage.setItem('cart', ''); 
            localStorage.setItem('overallTotalAmount', '');
            await this.storage.set('AmountAfterDeductDiscount', '');
            await this.storage.set('tap_id','');
            await this.storage.set('backtoViewbooking', 'viewBooking');
            const Order_id= await this.storage.set('Order_id','');
            this.navigateTothankyou();
          }
        });
        }
       
  }


  onPaymentMethodChange(event: any) {
    const selectedValue = event.detail.value; // Get the selected value from the event
    // console.log('Selected Payment Method:', selectedValue);
  
    if (selectedValue === 'creditCard') {
      // console.log('Selected Payment Method:', selectedValue);
    } else if (selectedValue === 'cashpay') {
      // console.log('Selected Payment Method:', selectedValue);
    }
  }
  
  async PrintCartData(){
    var cart_data_list = JSON.parse(localStorage.getItem('cart') || '[]');
    this.CartList = cart_data_list;
    // console.log('this.CartList',this.CartList)

    for (let index = 0; index < this.CartList.length; index++) {
      const item = this.CartList[index]; 
      const UserId = item.user_id;
      const ServiceName = item.services_id;
      const ServiceVariant = item.services_variants_id;

      // this.apiService.previousBookPackage(UserId, ServiceName, ServiceVariant).subscribe(response => {
      //   if (response) {
      //     if (response.status === true) {
      //       this.PastBookingArray = response.message; // Set the data to PastBookingArray if status is true
      //       this.CartList[index].package_arr = this.PastBookingArray;
      //       console.log('past-booking-array',this.PastBookingArray)
      //     } else {
      //       this.PastBookingArray = [];
      //       this.CartList[index].package_arr = [];
      //       console.log('past-booking-array-else',this.PastBookingArray)
      //     }
      //   } else {
      //     this.PastBookingArray = [];
      //     this.CartList[index].package_arr = [];
      //   }
      // });
      this.apiService.previousBookPackage(UserId, ServiceName, ServiceVariant).subscribe(response => {
        if (response) {
          if (response.status === true) {
            // Directly set the package_arr for the current CartList item
            this.CartList[index].package_arr = response.message;
            // console.log(`package_arr for CartList item at index ${index}:`, this.CartList[index].package_arr);
          } else {
            this.CartList[index].package_arr = []; // Empty array if status is false
            // console.log(`package_arr for CartList item at index ${index}:`, this.CartList[index].package_arr);
          }
        } else {
          this.CartList[index].package_arr = []; // Empty array if no response
        }
      });
    }

    
    this.CartList = this.CartList.map(item => ({
      ...item,
      selectedDates: new Array(item.quantity).fill(this.today) // Array to hold dates for each quantity
    }));

    // console.log('cart-',this.CartList);

    this.selectedaddressOption = await this.storage.get('selectedaddressOption');
    this.booking_type = await this.storage.get('booking_type');
    this.overalltotal  = localStorage.getItem('overallTotalAmount');
    if(this.booking_type != 'package'){
      this.showAddressAndDate = true; 
      this.showpackageDropdown = true;
      if (this.selectedaddressOption) {
        this.Title = await this.storage.get('selectedAddressTitle');
        this.Address = await this.storage.get('selectedAddress');
      }
        this.formattedDate = await this.storage.get('formattedDate'); 
        this.selectedTime = await this.storage.get('servicetime');
        
    } else{
      this.showAddressAndDate = false; 
      this.showCalender = true; 
    }    
  }
  async onPackageSelect(cartitem: any, index: number) {
    
    await this.storage.set('selectedPackageId', cartitem.selectedPackageId );
    console.log('cartitem.selectedPackageId',index+ cartitem.selectedPackageId);

    var CartList = JSON.parse(localStorage.getItem('cart') || '[]');
    CartList = CartList.map((item: any, idx: number) => {
      if (idx === index) {
        return { ...item, selectedPackageId: cartitem.selectedPackageId, 
          BookedFromPackage: 1 };
      } else {
        return { ...item, selectedPackageId: 0, 
          BookedFromPackage: 0 };
      }
    });
  
    // Save the updated CartList back to localStorage
    localStorage.setItem('cart', JSON.stringify(CartList));
    console.log('Updated loacal CartList:', CartList);
  
    const check_payment_radio = this.selectedPaymentMethod;
    if(check_payment_radio == 'cashpay'){
      this.selected_service_amount = cartitem.totalAmount;
      const overall_price = localStorage.getItem('overallTotalAmount');
      if(overall_price){
        const rest_amount = Number(overall_price) - this.selected_service_amount - this.selectedDiscountAmount + 20;
        this.finalAmount = rest_amount;
        this.totalAmountBeforeAnyDeduction = this.totalAmountBeforeAnyDeduction - this.selected_service_amount;
        const netAmountBeforeVAT = rest_amount / (1 + 5 / 100);    
        const vatAmount = rest_amount - netAmountBeforeVAT;
        this.vatAmount = Math.round(vatAmount * 100) / 100;
       
      }
    }else if(check_payment_radio == 'creditCard'){
      this.selected_service_amount = cartitem.totalAmount;
      const overall_price = localStorage.getItem('overallTotalAmount');
      if(overall_price){
        const rest_amount = Number(overall_price) - this.selected_service_amount - this.selectedDiscountAmount;
        this.finalAmount = rest_amount;
        this.totalAmountBeforeAnyDeduction = this.totalAmountBeforeAnyDeduction- this.selected_service_amount;
        const netAmountBeforeVAT = rest_amount / (1 + 5 / 100);    
        const vatAmount = rest_amount - netAmountBeforeVAT;
        this.vatAmount = Math.round(vatAmount * 100) / 100;
      }
    }

    if(this.totalAmountBeforeAnyDeduction === 0){
      this.hideDiscountRow = false;
      this.addCashPaymentCharges = false;
      this.creditPay = true;
      this.finalAmount = 0;
      this.hideRadioButton = false;
    }
  }

  updateSelectedDate(cartitem: any, index: number) {
    this.updateConsolidatedDates();
    this.updateMergedList();
    // console.log(this.consolidatedDates); // Log the consolidated array in the desired format
  }
  
  updateConsolidatedDates() {
    // Reset the array and flatten all dates from `CartList` into `consolidatedDates`
    this.consolidatedDates = [];
    this.CartList.forEach(cartitem => {
      cartitem.selectedDates.forEach((date: any) => {
        this.consolidatedDates.push(date);  // Append each date individually to make it a flat array
      });
    });
  }

  updateMergedList(){
    let CartList = JSON.parse(localStorage.getItem('cart') || '[]');
    // Function to transform CartList based on quantity
    function transformCartList(cartList: any[]): any[] {
        const transformedList: any[] = [];
        cartList.forEach(item => {
            item.selectedDates = Array(item.quantity).fill(null);
            for (let i = 0; i < item.quantity; i++) {
                transformedList.push({ ...item, quantity: 1 });
            }
        });
        return transformedList;
    }
    
    // Transform CartList and store it in transformedData
    const transformedData = transformCartList(CartList);
      // Merge selectedDates from CartList into transformedData based on index
      let transformedIndex = 0;
      this.CartList.forEach(cartitem => {
          cartitem.selectedDates.forEach((date: any) => {
              if (transformedData[transformedIndex]) {
                  transformedData[transformedIndex].selectedDate = date;
              }
              transformedIndex++;
          });
      });

      const extractedData = transformedData.map(item => ({
          user_id: item.user_id,
          id: item.id,
          selectedDate: item.selectedDate || new Date().toISOString().split('T')[0] 
      }));
      
      // Get the total length of the array
      const totalLength = transformedData.length;
      
      // console.log("Extracted Data:", extractedData);
      // console.log("Total Length of Array:", totalLength);

      const result: {
        user_id: string[];
        package_id: string[];
        payment_type: string[];
        start_date: string[];
        total_count: number;
    } = {
        user_id: [],
        package_id: [],
        payment_type: [],
        start_date: [],
        total_count: 0 // Will be updated to transformedData.length later
    };

    // Assuming transformedData has been populated as shown in your example
    result.total_count = transformedData.length;

    // Populate each field array from transformedData
    transformedData.forEach(item => {
        result.user_id.push(String(item.user_id));
        result.package_id.push(String(item.id));
        result.payment_type.push(item.payment_type ? String(item.payment_type) : "2"); // Default if payment_type is missing
        result.start_date.push(item.selectedDate);
    });

    this.resultJson = JSON.stringify(result);
    // console.log("Result as JSON:", this.resultJson );
   
  }
// Helper function to ensure the date is in the correct format
  formatDate(date: string): string {
    // Ensure the date is in YYYY-MM-DD format for consistency
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  checkbox1() {
    this.paybtn = true;
    this.checkbox1();
  }

  checkbox2() {
    this.paybtn = false;
  }

  async visiblePay() {
    // console.log('run')
    this.pay_byCard = true;
    this.addCashPaymentCharges = false;
    this.creditPay = false;
    this.selectCashPay = true;
    this.IntialPriceWithoutCheck();
  }

  async IntialPriceWithoutCheck(){
    this.totalAmountBeforeAnyDeduction = localStorage.getItem('overallTotalAmount');
    this.overalltotal  = localStorage.getItem('amount');
    this.AmountAfterDeductDiscount = await this.storage.get('AmountAfterDeductDiscount');
    // console.log('wewew',this.AmountAfterDeductDiscount);
    if(this.AmountAfterDeductDiscount){
      // this.totalAmountBeforeAnyDeduction = this.totalAmountBeforeAnyDeduction- this.selected_service_amount;
      this.finalAmount = Number(this.AmountAfterDeductDiscount);
      const netAmountBeforeVAT = this.finalAmount / (1 + 5 / 100);
      const vatAmount = this.finalAmount - netAmountBeforeVAT;
      this.vatAmount = (Math.round(vatAmount * 100) / 100).toFixed(2);
    } else{
      // this.totalAmountBeforeAnyDeduction = this.totalAmountBeforeAnyDeduction- this.selected_service_amount;
      this.finalAmount = Number(this.totalAmountBeforeAnyDeduction);
      const netAmountBeforeVAT = this.finalAmount / (1 + 5 / 100);
      const vatAmount = this.finalAmount - netAmountBeforeVAT;
      this.vatAmount = (Math.round(vatAmount * 100) / 100).toFixed(2);
    } 
  }

  onCheckboxChange(cartitem: any, event: any) {

    if (!cartitem.isChecked) {
      // If unchecked, set BookFromMassage to 0 for the current index
      let CartList = JSON.parse(localStorage.getItem('cart') || '[]');
      const index = CartList.findIndex((item: { id: any; }) => item.id === cartitem.id);
      if (index !== -1) {
        // Set BookFromMassage to 0 if checkbox is unchecked
        CartList[index].BookedFromPackage = 0;
        localStorage.setItem('cart', JSON.stringify(CartList));
      }
    }
    
    const isChecked = event.detail.checked;  // This will be true if checked, false if unchecked
      if (isChecked) {
        cartitem.selectedPackageId = '';      
      } else {
        this.hideDiscountRow = true;
        this.addCashPaymentCharges = true;
        this.creditPay = true;
        this.hideRadioButton = true;
        const check_payment_radio = this.selectedPaymentMethod;
        if(check_payment_radio == 'cashpay'){
          this.IntialCashPayWithoutCheck();
        }else if(check_payment_radio == 'creditCard'){
          this.IntialPriceWithoutCheck();
        }
    }
  }

  cashPay() {
    this.pay_byCard = false;
    this.addCashPaymentCharges = true;
    this.creditPay = true;
    this.selectCashPay = true;
    this.IntialCashPayWithoutCheck(); 
    this.updateMergedList();
  }

  async IntialCashPayWithoutCheck(){
    this.totalAmountBeforeAnyDeduction = localStorage.getItem('overallTotalAmount');
    this.overalltotal = localStorage.getItem('amount');
    this.AmountAfterDeductDiscount = await this.storage.get('AmountAfterDeductDiscount');
    console.log('totalAmountBeforeAnyDeduction',this.totalAmountBeforeAnyDeduction);
    console.log('AmountAfterDeductDiscount',this.AmountAfterDeductDiscount);
    if(this.AmountAfterDeductDiscount){   
      // console.log('this.totalAmountBeforeAnyDeduction', this.totalAmountBeforeAnyDeduction) 
      this.finalAmount = Number(this.AmountAfterDeductDiscount) + 20;
      const netAmountBeforeVAT = this.finalAmount / (1 + 5 / 100);
      const vatAmount = this.finalAmount - netAmountBeforeVAT;
      this.vatAmount = Math.round(vatAmount * 100) / 100;
      // console.log('hlpd',this.vatAmount)
    } else{
      this.finalAmount = Number(this.totalAmountBeforeAnyDeduction) + 20;
      const netAmountBeforeVAT = this.finalAmount / (1 + 5 / 100);
      const vatAmount = this.finalAmount - netAmountBeforeVAT;
      this.vatAmount = Math.round(vatAmount * 100) / 100;
      // console.log('you',this.vatAmount)
    } 
  }

  async navigateToSelectdatetime() {
   const checkViewbooking =  await this.storage.get('backtoViewbooking');
   if(checkViewbooking === 'viewBooking'){
    this.router.navigate(['/view-booking'])
    } else{
    this.router.navigate(['/select-date-time']);
   }
  }

  payByCard() {
    this.creditPay = false;
  }

  async printPreviousBookedPackage() {
    const CartList = JSON.parse(localStorage.getItem('cart') || '[]');
    this.PastBookingArray = [];
    
    for (const item of CartList) {
      const UserId = item.user_id;
      const ServiceName = item.services_id;
      const ServiceVariant = item.services_variants_id;
  
      // Await each API call to finish before continuing
      try {
        const response = await this.apiService.previousBookPackage(UserId, ServiceName, ServiceVariant).toPromise();
  
        if (response && response.status === true) {
          this.PastBookingArray.push(...response.message); // Append data if status is true
        }
      } catch (error) {
        console.error('Error fetching booking package:', error);
      }
    }

    // After all API calls, you can print or store the final array with merged data
    this.printServiceRealtedPackages = CartList; // The CartList now has the previous booking data merged
    // console.log('Merged CartList:', CartList); // This will print the entire CartList with merged response data.
  }
  
  insertPackages(){
    const resultJson = this.resultJson
    this.apiService.insertOnlypackage(resultJson).subscribe((response) => {
      if (response.status === true) {
        this.navigateTothankyou();
        // console.log('Response for item:', response);
      }
    });
  }

  navigateTothankyou() {
    this.router.navigate(['/thankyou']);
  
    setTimeout(() => {
      this.router.navigate(['/tabs/tab1']); 
    }, 3000); 
  }
  
  async CashPayBook(){
    this.booking_type = await this.storage.get('booking_type');
    if(this.booking_type === 'package'){
        this.insertPackages();
     
    } else{
    const customer_id = await this.storage.get('user_index_id');
    const selectedLocationUrl = await this.storage.get('selectedLocationUrl');
    // const selectedDate = await this.storage.get('servicedate');
    const selectedDate = localStorage.getItem('ServiceDate');
    const servicetime = this.selectedTime;
    const service_category = await this.storage.get('service_category');
    const service_employee = await this.storage.get('EmployeeID');
    const service_location = await this.storage.get('ServiceLocation'); 
    // console.log('service_location', service_location)
    const booking_zone_id = 0;
    const status = 0;
    const booking_comment = 'Testing';
    const package_id = await this.storage.get('selectedPackageId');
    // const package_used = this.package_used;
    const discounted_coupon = await this.storage.get('selectedDiscountCode');
    const discount_amount = await this.storage.get('selectedDiscountAmount');
    const discounted_amount = await this.storage.get('AmountAfterDeductDiscount');
    // const package_id = await this.storage.get('selectedPackageId');
    // console.log('servicedate', selectedDate)

    var CartList = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log('cart-list', CartList)
    const totalAmountSum = CartList.reduce((sum: number, item: any) => sum + item.totalAmount, 0);
    console.log(this.booking_type);
    if(this.booking_type === 'Couple'){
       this.couple_booking_employee_count = 2;
       this.people_count = 2;
    }else{
      this.couple_booking_employee_count = 1;
      this.people_count = 1;
    }

    const updatedCartDataList = CartList.map((item: any) => {
      return {
        customer_id: customer_id,
        location_url: selectedLocationUrl,
        servicedate: selectedDate,
        servicetime: servicetime,
        service_category: service_category,
        service_name: item.services_id,
        service_employee: service_employee,
        service_location: service_location,
        booking_zone_id: booking_zone_id,
        status: status,
        service_variant: item.services_variants_id,
        variant_id: item.id,
        booking_comment: booking_comment,
        package_id: package_id,
        // package_used: this.package_used,
        package_used: item.BookedFromPackage,
        actual_amount: totalAmountSum,
        discounted_coupon: discounted_coupon,
        discount_option: 0,
        discount_amount: discount_amount,
        discounted_amount: discounted_amount,
        total_price: this.finalAmount,
        package_used_count: item.BookedFromPackage,
        payment_link: '',
        booking_type: this.booking_type,
        // booking_type: this.booking_type,
        couple_booking_employee_count: this.couple_booking_employee_count,
        payment_cash: this.finalAmount,
        people_count: this.people_count,
        service_employee_2: 0,
        service_employee_3: 0,
        service_employee_4: 0
      };
      
    });
     console.log('updatedCartDataList',updatedCartDataList)
    this.apiService.insertAllBookingData({service_data: updatedCartDataList}).subscribe(async (response)=>{
      if(response.status === true){
        this.booking_id = response.booking_id;
        await this.storage.set('booking_id', this.booking_id);
        localStorage.setItem('headerCart', '');
        localStorage.setItem('cart', ''); 
        localStorage.setItem('overallTotalAmount', '');
        await this.storage.set('AmountAfterDeductDiscount', '');
        await this.storage.set('backtoViewbooking', 'viewBooking');
        this.navigateTothankyou();
      }
    });
    }
   
  }
}