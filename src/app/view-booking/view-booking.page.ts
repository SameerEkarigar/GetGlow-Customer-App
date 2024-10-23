import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { LoadingServiceService } from '../services/loading-service.service';

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
  constructor(
    private modalController: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private Storage: Storage,
    private loadingService: LoadingServiceService
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

      if(cart_len != 0){
        this.HeaderQyt = cart_len;
        
      }else{
        this.HeaderQyt = '';
      }
      
    } else {
      this.HeaderQyt = '';
    }
  }

  async ngOnInit() {  
    this.printDiscountOffer();
    localStorage.setItem('select_address_cat', '');
    this.user_id = await this.Storage.get('user_id');
    this.Initial_cart_list();
    this.printFrequentlyBooked();
    this.total_amount = localStorage.getItem('overallTotalAmount');
    this.CalculateHeaderItem();
  }

  Initial_cart_list(){
    var cart_data_list = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cart_data = cart_data_list;
  }

 async printFrequentlyBooked() {
    this.loadingService.presentLoading(); 
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
        
      }
      this.loadingService.dismissLoading();
    });
  }

  storeDiscountCode() {
    this.storedDiscountCode = this.enteredDiscountCode;
    // Perform any additional actions with the storedDiscountCode
    if(this.storedDiscountCode === ''){
      this.viewOffer = 'View Offers'
    } else {
        this.viewOffer = 'Remove Offers'
    }
   
    console.log('Stored discount code:', this.storedDiscountCode);
  }

 async applyAndStoreDiscount(couponName?: string, discountAmount?: any) {
    if (couponName && discountAmount) {
      this.enteredDiscountCode = couponName;
      this.selectedDiscountAmount = discountAmount;
      await this.Storage.set('selectedDiscountAmount', this.selectedDiscountAmount);
      await this.Storage.set('selectedDiscountCode', this.enteredDiscountCode);
      this.AmountAfterDeductDiscount = this.total_amount-this.selectedDiscountAmount;
      await this.Storage.set('AmountAfterDeductDiscount', this.AmountAfterDeductDiscount);
    }
  
    this.storedDiscountCode = this.enteredDiscountCode;
    this.modalController.dismiss();
    this.viewOffer = 'Remove Offer';
    if(this.enteredDiscountCode === ''){
       this.viewOffer = 'View Offers'
       this.selectedDiscountAmount = '';
    }
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
      this.CalculateHeaderItem();
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
      
      } else {
        // console.log('Item not found in cart');
      }
    } else {
      // console.log('Cart is empty');
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
      // console.log('Cart is empty');
    }
  }

  toggleAddButton(index: number) {
    this.frequentData[index].addButton = !this.frequentData[index].addButton;

    if (this.frequentData[index].addButton) {
      // If item is added, move it to the "Your Bookings" section
      this.addItemToBooking(index);
    }
  }

  addItemToBooking(index: number) {
    const item = this.frequentData[index];
    // console.log(item);
    item.addButton = true;
    // Check if item is already in the "Your Bookings" section
    const existingItemIndex = this.addedItems.findIndex(added => added.name === item.name);
    if (existingItemIndex === -1) {
      // Set totalAmount to the discounted_price for new items
      this.cart_data.push({ ...item, totalAmount: item.discounted_price }); // Add new item
      this.PushCartDisCountPrice();
      this.CalculateHeaderItem();
    } else {
      this.addedItems[existingItemIndex].quantity++;
    }
    this.frequentData.splice(index, 1);
   
  }

  // This Funtion Is used for when initially item add to cart and also increase the overall amount
  // this functionis used for addItemToBooking() function
  PushCartDisCountPrice() {
    const prev_cart_data = localStorage.getItem('cart');
    let previousCart = prev_cart_data ? JSON.parse(prev_cart_data) : [];
  
    const newCartItems = this.cart_data
      .filter(variant => variant.addButton && variant.quantity > 0) // Only save variants that have been added and have quantity
      .map(variant => ({
        id: variant.id,
        name: variant.name,
        quantity: variant.quantity,
        duration: variant.sv_duration,
        totalAmount: Number(variant.discounted_price),  // Convert to number
        services_variants_id: variant.service_variants,
        unitAmount: Number(variant.discounted_price),  // Convert to number
        booking_type: 'frequent',
        user_id: this.user_id,
        service_category: variant.service_category
      }));
  
    // Merge previous cart data with new cart items
    newCartItems.forEach(newItem => {
      const existingItem = previousCart.find((item: { id: any }) => item.id === newItem.id);
      if (existingItem) {
        existingItem.quantity = newItem.quantity;
        existingItem.totalAmount = Number(newItem.totalAmount);  // Ensure totalAmount is set to discounted_price
        existingItem.unitAmount = Number(newItem.unitAmount);
      } else {
        previousCart.push({ ...newItem });
      }
    });

    localStorage.setItem('cart', JSON.stringify(previousCart));

    let OverAllTotal = previousCart.reduce((accumulator: number, item: { totalAmount: number, unitAmount: number, quantity: number }) => {
      return accumulator + (item.unitAmount * item.quantity);
    }, 0);

    this.total_amount = OverAllTotal;

    localStorage.setItem('overallTotalAmount', OverAllTotal.toString());
  }
  // This Funtion Is used for when initially item add to cart and also increase the overall amount

 async navigateToselectAddress(){
    // const service_category_id = this.route.snapshot.paramMap.get('service_category')  || '';
    const service_category_id =  await this.Storage.get('service_category');
    localStorage.setItem('select_address_cat', service_category_id);
    this.router.navigate(['/select-address']);
  }
async navigateTospaLadies(){
    // window.location.reload();
    // const SpaLadiesURL1 = localStorage.getItem('spa_ladies_url_1'); 
    // window.location.reload();
    const SpaLadiesURL1 = await this.Storage.get('spa_ladies_url_1')
    // console.log(SpaLadiesURL1)
    // const SpaLadiesURL2 = localStorage.getItem('spa_ladies_url_2');
    const SpaLadiesURL2 = await this.Storage.get('spa_ladies_url_2');
    // window.location.reload();
    this.router.navigate(['/spa-ladies',SpaLadiesURL1,SpaLadiesURL2]);
    // window.location.reload();
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
