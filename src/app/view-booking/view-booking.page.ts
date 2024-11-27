import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { LoadingServiceService } from '../services/loading-service.service';
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.page.html',
  styleUrls: ['./view-booking.page.scss'],
})
export class ViewBookingPage implements OnInit {
  cart_data: any [] = [];
  total_amount: any;
  frequentData: any [] = [];
  addedItems: any[] = [];
  user_id: any;
  HeaderQyt: any;
  printdiscount: any;
  enteredDiscountCode: any = '';
  storedDiscountCode: any;
  viewOffer: string = 'View Offers';
  selectedDiscountAmount: any;
  AmountAfterDeductDiscount: any;
  frequentbookingtext = '';
  btn_text: string = 'Continue To Address';
  selectStartDate: boolean = false;
  ShowIfdiscountSelect: boolean = false;
  hideDiscountRow: boolean = true;
  vatAmount: any;
  constructor(
    private modalController: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private Storage: Storage,
    private loadingService: LoadingServiceService,
    private location: Location,
    private cdr: ChangeDetectorRef,
  ){
    this.init();
  }

  async init() {
    await this.Storage.create();
  }
    
  CalculateHeaderItem(){
    const prev_cart_data = localStorage.getItem('cart');
    if (prev_cart_data) {
      const cartItems = JSON.parse(prev_cart_data);
      const cart_len = cartItems.length;
      //console.log('cart_len', cart_len);
      if(cart_len != 0){
        this.HeaderQyt = cart_len;
        localStorage.setItem('headerCart',  this.HeaderQyt);
        
      }else{
        this.HeaderQyt = '';
        localStorage.setItem('headerCart',  this.HeaderQyt);
      }
      
    } else {
      this.HeaderQyt = '';
      localStorage.setItem('headerCart',  this.HeaderQyt);
    }
  }

  async ngOnInit() {  
    this.printDiscountOffer();
    localStorage.setItem('select_address_cat', '');
    this.user_id = await this.Storage.get('user_id');
    this.Initial_cart_list();  
    this.vatAmountOnPAgeLOAd();
    // console.log(roundedTwoDecimals)
    // console.log('without dis',vatAmount)
    this.CalculateHeaderItem();
  }

  async vatAmountOnPAgeLOAd(){
    this.total_amount = localStorage.getItem('overallTotalAmount');
    const netAmountBeforeVAT = this.total_amount / (1 + 5 / 100);
    const vatAmount = this.total_amount - netAmountBeforeVAT;
    this.vatAmount = (Math.round(vatAmount * 100) / 100).toFixed(2);
    await this.Storage.set('vatAmount', this.vatAmount);
  }

  async Initial_cart_list() {
    const cart_data_list = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cart_data = cart_data_list;
  
    for (const item of this.cart_data) {
      const booking_type = item.booking_type;
      
      // Await setting booking_type in Storage
      await this.Storage.set('booking_type', booking_type);
      
      if (booking_type !== 'package') {
        this.printFrequentlyBooked();
        this.frequentbookingtext = 'Frequently Booked Together';
      } else if(booking_type === 'package'){
        this.selectStartDate = true;
        this.hideDiscountRow = false;
      }
    }
  }

  async navigateToPayment(){
    await this.Storage.set('backtoViewbooking', 'viewBooking');
    this.router.navigate(['/payment-page']);
  }

 async printFrequentlyBooked() {
    // this.loadingService.presentLoading(); 
    // const service_category_id = this.route.snapshot.paramMap.get('service_category');
    const service_category_id = await this.Storage.get('service_category');
    this.apiService.getFrequentlyBooked(service_category_id).subscribe((response) => {
      if (response && response.message) {
        // Initialize quantity and extract the duration from sv_name
        this.frequentData = response.message.map((item: any) => {
          const durationMatch = item.sv_name.match(/\d+\s?mins/);
          const duration = durationMatch ? durationMatch[0] : '';

          return {
            ...item,
            quantity: item.quantity || 1, // Initialize quantity
            duration: duration, // Extract duration from sv_name
            addButton: false // Initially, items are not added
          };

        });
        // //console.log('frequent- : ',this.frequentData);
      }
      // this.loadingService.dismissLoading();
    });
  }

 async applyAndStoreDiscount(couponName?: string, discountAmount?: any) {
    if (couponName && discountAmount) {
      this.enteredDiscountCode = couponName;
      this.selectedDiscountAmount = discountAmount;
      await this.Storage.set('selectedDiscountAmount', this.selectedDiscountAmount);
      await this.Storage.set('selectedDiscountCode', this.enteredDiscountCode);
      this.AmountAfterDeductDiscount = this.total_amount - this.selectedDiscountAmount;
      const netAmountBeforeVAT = this.AmountAfterDeductDiscount / (1 + 5 / 100);
      
      const vatAmount = this.AmountAfterDeductDiscount - netAmountBeforeVAT;
      this.vatAmount = (Math.round(vatAmount * 100) / 100).toFixed(2);
      await this.Storage.set('vatAmount', this.vatAmount);
      // console.log(roundedTwoDecimals);
      await this.Storage.set('AmountAfterDeductDiscount', this.AmountAfterDeductDiscount);
      this.ShowIfdiscountSelect = true;
      localStorage.setItem('amount',this.AmountAfterDeductDiscount);
    }
  
    this.storedDiscountCode = this.enteredDiscountCode;
    this.modalController.dismiss();
    this.viewOffer = 'Remove Offer';
    if(this.enteredDiscountCode === ''){
       this.viewOffer = 'View Offers'
       this.selectedDiscountAmount = '';
    }
  }
  
 async storeDiscountCode() {
    this.storedDiscountCode = this.enteredDiscountCode;
    // Perform any additional actions with the storedDiscountCode
    if(this.storedDiscountCode === ''){
      this.viewOffer = 'View Offers'
      await this.Storage.remove('selectedDiscountAmount');
      await this.Storage.remove('selectedDiscountCode');
      await this.Storage.remove('AmountAfterDeductDiscount');
    } else {
        this.viewOffer = 'Remove Offers'
    }
   
    //console.log('Stored discount code:', this.storedDiscountCode);
  }
  async clearOffer(viewOffer: string) {
    // console.log('View Offer Text:', viewOffer);
    if (viewOffer === 'Remove Offer') {
      this.vatAmountOnPAgeLOAd();
      this.ShowIfdiscountSelect = false;
      localStorage.setItem('amount',this.total_amount)
      this.enteredDiscountCode = '';
      this.storedDiscountCode = '';
      this.selectedDiscountAmount ='';
      await this.Storage.set('selectedDiscountAmount', '');
      await this.Storage.set('selectedDiscountCode', '');
      await this.Storage.set('AmountAfterDeductDiscount', '');
      // console.log('Removing the offer');
    } else{
      await this.Storage.set('AmountAfterDeductDiscount', this.AmountAfterDeductDiscount );
    }
  }
  openOffers(){
    // console.log('click on Open offer')
  }
  IncreaseCartQuantity(i: number) {
    // Increase the quantity of the item
    this.cart_data[i].quantity += 1;
    
    // Ensure the total amount is updated by multiplying the quantity with the unit price
    const unitPrice = this.cart_data[i].totalAmount / (this.cart_data[i].quantity - 1); // Derive unit price
    this.cart_data[i].totalAmount = unitPrice * this.cart_data[i].quantity;

    const item_id = this.cart_data[i].id;
    const new_quantity = this.cart_data[i].quantity;
    const new_totalAmount = this.cart_data[i].totalAmount;
    
    this.UpdateCartItem(item_id,new_quantity,new_totalAmount);
  }

  DeductCartQuantity(i: number) {
    if (this.cart_data[i].quantity > 1) {
      // Decrease the quantity if greater than 1
      this.cart_data[i].quantity -= 1;
  
      // Calculate the new totalAmount based on the updated quantity
      const unitPrice = this.cart_data[i].totalAmount / (this.cart_data[i].quantity + 1); // Previous unit price
      this.cart_data[i].totalAmount = unitPrice * this.cart_data[i].quantity;
      
      const item_id = this.cart_data[i].id;
      const new_quantity = this.cart_data[i].quantity;
      const new_totalAmount = this.cart_data[i].totalAmount;
      
      this.UpdateCartItem(item_id,new_quantity,new_totalAmount);
      this.cdr.detectChanges();

    } else {

      const item_id = this.cart_data[i].id;
      const item_row = this.cart_data[i];
      const static_type = this.cart_data[i].service_type_static;
      this.RemoveCartItem(item_id);
      this.cart_data.splice(i, 1); // Remove the item from the array

      item_row.addButton = false;
      item_row.quantity = 0;
      if(static_type){
        this.frequentData.push({ ...item_row });
      }
      // this.UpdateCartItem(item_id, 0, 0);
      this.CalculateHeaderItem();
      this.cdr.detectChanges();
    }
  }

  UpdateCartItem(item_id: any, new_quantity: any, new_totalAmount: any) {
    // Get the cart from local storage
    const my_cart = localStorage.getItem('cart');

    if (my_cart) {
      // Parse the cart data into an array
      let cartItems = JSON.parse(my_cart);
      
      // Find the index of the item with the matching id
      const index = cartItems.findIndex((item: any) => item.id === item_id);
      
      // If item exists, update its quantity and totalAmount
      if (index !== -1) {
        cartItems[index].quantity = new_quantity;
        cartItems[index].totalAmount = new_totalAmount;
        
        // Save the updated cart back to local storage
        localStorage.setItem('cart', JSON.stringify(cartItems));

        let total = cartItems.reduce((accumulator: number, item: { totalAmount: number, unitAmount: number, quantity: number }) => {
          return accumulator + (item.unitAmount * item.quantity);
        }, 0);

        this.total_amount = total;
        
        localStorage.setItem('overallTotalAmount', total.toString());

        const cart_lenght = cartItems.length;
        
        if(cart_lenght != 0){
          this.HeaderQyt = cart_lenght;
          localStorage.setItem('headerCart',  this.HeaderQyt);
        }else{
          this.HeaderQyt = '';
          localStorage.setItem('headerCart',  this.HeaderQyt);
        }
      
      } else {
        // //console.log('Item not found in cart');
      }
    } else {
      // //console.log('Cart is empty');
    }
  }

  RemoveCartItem(item_id: any) {
    // Get the cart from local storage
    const my_cart = localStorage.getItem('cart');
    
    if (my_cart) {
      // Parse the cart data into an array
      let cartItems = JSON.parse(my_cart);
      
      // Filter out the item with the matching id
      cartItems = cartItems.filter((item: any) => item.id !== item_id);
      
      let total = cartItems.reduce((accumulator: number, item: { totalAmount: number, unitAmount: number, quantity: number }) => {
        return accumulator + (item.unitAmount * item.quantity);
      }, 0);
  
      this.total_amount = total;

      localStorage.setItem('overallTotalAmount', total.toString());

      // Update the cart in local storage
      localStorage.setItem('cart', JSON.stringify(cartItems));

    } else {
      // //console.log('Cart is empty');
    }
  }

  toggleAddButton(index: number) {
    this.frequentData[index].addButton = !this.frequentData[index].addButton;

    if (this.frequentData[index].addButton) {
      // If item is added, move it to the "Your Bookings" section
      this.addItemToBooking(index);
    }
  }


  async addItemToBooking(index: number) {
    const newServiceType = 'frequent';
        const newDurationNumber = this.frequentData[index].duration;
    
        // Retrieve previous cart data
        const prev_cart_data = localStorage.getItem('cart');
        const previousCart = prev_cart_data ? JSON.parse(prev_cart_data) : [];
    
        const existingServiceTypes = [...new Set(previousCart.map((item: { service_type: any; }) => item.service_type))];
        // //console.log('existingServiceTypes',existingServiceTypes)
        const hasConflict = existingServiceTypes.length > 0 &&
                            !existingServiceTypes.includes(newServiceType);

        const booking_type= await this.Storage.get('booking_type'); 
        if(booking_type === 'package'){
          if (hasConflict) {
            alert(`This Service cannot be added. There are already services of type: ${existingServiceTypes.join(', ')} in your cart.`);
            return; // Exit early to prevent UI updates
        }
        } 

        const totalDuration = previousCart.reduce((sum: number, item: { duration_number: any; }) => {
          // Parse the duration_number to ensure it's a number
          const duration = parseInt(item.duration_number, 10);
          
          // Check if the duration is a valid number
          if (!isNaN(duration)) {
              return sum + duration; // Add the parsed duration to the sum
          } else {
              console.error(`Invalid duration_number: ${item.duration_number}`);
              return sum; // If invalid, just return the current sum
          }
        }, 0) + (typeof newDurationNumber === 'number' ? newDurationNumber : parseInt(newDurationNumber, 10));
      
        if (totalDuration > 180) {
            alert(`We are unable to set a maximum massage duration of 180 minutes.`);
            return; // Exit early to prevent UI updates
        }                  
       

    const item = this.frequentData[index]; // Get the item to be added
    const tempItem = { ...item, 
      totalAmount: item.discounted_price, 
      quantity: 1,
      addButton: true
    };
    
    // item.addButton = true;
  
    // Add the validated item to the cart
    const existingItemIndex = this.addedItems.findIndex(added => added.name === item.name);
    if (existingItemIndex === -1) {
      this.cart_data.push(tempItem);
      this.PushCartDisCountPrice();
      this.CalculateHeaderItem();
    } else {
      // If item already exists, increment its quantity
      this.addedItems[existingItemIndex].quantity++;
    }
  
    // Remove the item from frequentData after adding it to cart
    this.frequentData.splice(index, 1);
  }
  
  // Helper function to check for service type conflicts
  hasServiceTypeConflict(cart: any[]): boolean {
    const serviceTypes = [...new Set(cart.map(item => item.service_type))];
    return serviceTypes.length > 1; // Conflict exists if more than one unique service type
  }
  
  // Helper function to check if the total duration exceeds the limit
  exceedsDurationLimit(cart: any[]): boolean {
    const totalDuration = cart.reduce(
      (sum, item) => sum + Number(item.duration_number), 
      0
    );
    return totalDuration > 180; // Return true if total duration exceeds 180 minutes
  }  

  PushCartDisCountPrice() {
    
    const prev_cart_data = localStorage.getItem('cart');
    let previousCart = prev_cart_data ? JSON.parse(prev_cart_data) : [];

    const newCartItems = this.cart_data
      .filter(variant => variant.addButton && variant.quantity > 0)
      .map(variant => ({
        id: variant.id,
        name: variant.name,
        quantity: variant.quantity,
        duration: variant.sv_duration,
        totalAmount: Number(variant.discounted_price),
        services_variants_id: variant.service_variants,
        unitAmount: Number(variant.discounted_price),
        booking_type: 'frequent',
        user_id: this.user_id,
        service_category: variant.service_category,
        duration_number: this.extractDurationNumber(variant.sv_duration),
        service_type: variant.sv_name.split(' - ')[0].trim(),
      }));

    // Merge the new items into the previous cart
    newCartItems.forEach(newItem => {
      const existingItem = previousCart.find((item: { id: any; }) => item.id === newItem.id);
      if (existingItem) {
        existingItem.quantity = newItem.quantity;
        existingItem.totalAmount = Number(newItem.totalAmount);
        existingItem.unitAmount = Number(newItem.unitAmount);
      } else {
        previousCart.push({ ...newItem });
      }
    });

    // //console.log(previousCart);
    localStorage.setItem('cart', JSON.stringify(previousCart));

    const OverAllTotal = previousCart.reduce(
      (accumulator: number, item: { unitAmount: number; quantity: number; }) => accumulator + (item.unitAmount * item.quantity),
      0
    );

    this.total_amount = OverAllTotal;
    localStorage.setItem('overallTotalAmount', OverAllTotal.toString());
    
    
    
    
    
    
    
    
    
    
    // const prev_cart_data = localStorage.getItem('cart');
    // let previousCart = prev_cart_data ? JSON.parse(prev_cart_data) : [];
  
    // // Get unique service types from the previous cart items
    // // const existingServiceTypes = [...new Set(previousCart.map((item: { service_type: any; }) => item.service_type))];
  
    // // Filter and map new cart items with necessary fields

    // //console.log("cart items : ",this.cart_data);

    // const newCartItems = this.cart_data
    //   .filter(variant => variant.addButton && variant.quantity > 0)
    //   .map(variant => ({
    //     id: variant.id,
    //     name: variant.name,
    //     quantity: variant.quantity,
    //     duration: variant.sv_duration,
    //     totalAmount: Number(variant.discounted_price),
    //     services_variants_id: variant.service_variants,
    //     unitAmount: Number(variant.discounted_price),
    //     booking_type: 'frequent',
    //     user_id: this.user_id,
    //     service_category: variant.service_category,
    //     duration_number: this.extractDurationNumber(variant.sv_duration), // Extract numeric duration
    //     service_type: variant.sv_name.split(' - ')[0].trim(),
    //   }));
  
    // // Merge the new items into the previous cart
    // newCartItems.forEach(newItem => {
    //   const existingItem = previousCart.find((item: { id: any; }) => item.id === newItem.id);
    //   if (existingItem) {
    //     // Update existing item's quantity and prices
    //     existingItem.quantity = newItem.quantity;
    //     existingItem.totalAmount = Number(newItem.totalAmount);  // Ensure discounted_price is used
    //     existingItem.unitAmount = Number(newItem.unitAmount);
    //   } else {
    //     // Add new item to the cart if it doesn't exist
    //     previousCart.push({ ...newItem });
    //   }
    // });
  
    // //console.log('previus cart : ',previousCart);
    // // Save the updated cart back to localStorage
    // localStorage.setItem('cart', JSON.stringify(previousCart));
  
    // // Calculate the overall total amount
    // const OverAllTotal = previousCart.reduce(
    //   (accumulator: number, item: { unitAmount: number; quantity: number; }) => accumulator + (item.unitAmount * item.quantity),
    //   0
    // );
  
    // // Save the overall total amount in the component and localStorage
    // this.total_amount = OverAllTotal;
    // localStorage.setItem('overallTotalAmount', OverAllTotal.toString());
  }
  
  // Extract numeric part from the duration string (e.g., "90min" -> 90)
  extractDurationNumber(duration: string): number {
    const match = duration.match(/\d+/); // Match the numeric part
    return match ? Number(match[0]) : 0;  // Convert to number or return 0 if no match
  }
  

  // This Funtion Is used for when initially item add to cart and also increase the overall amount

 async navigateToselectAddress(){
    // const service_category_id = this.route.snapshot.paramMap.get('service_category')  || '';
    const service_category_id =  await this.Storage.get('service_category');
    localStorage.setItem('select_address_cat', service_category_id);
    this.router.navigate(['/select-address']);
  }
  async navigateTospaLadies(){
    const SpaLadiesURL1 = await this.Storage.get('spa_ladies_url_1')
    // const SpaLadiesURL2 = localStorage.getItem('spa_ladies_url_2');
    const SpaLadiesURL2 = await this.Storage.get('spa_ladies_url_2');
    // window.location.reload();
     if(SpaLadiesURL1){
      this.router.navigate(['/spa-ladies',SpaLadiesURL1,SpaLadiesURL2]);
     }
     else{
      this.router.navigate(['/tabs/tab1']);
     }
  }

  customClose() {
    this.modalController.dismiss();
  }
  printDiscountOffer(){
    this.apiService.getDiscountOffer().subscribe((response)=>{
      if(response.status===true){
        this.printdiscount = response.message;
      }
    })
  }

}
