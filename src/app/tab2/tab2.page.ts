import { ApiService } from 'src/app/services/api.service';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { response } from 'express';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {
  showFirstDiv: boolean = true;
  confirmbooking: boolean =true;
  // showCancelStatus: boolean=true;
  upComingBookingData: any[] = [];
  showUpcommingBooking: boolean = true;
  activeButton: string = 'upcoming';
  pastBooking: any;
  noDataFound: boolean = false;
  noUpcomingFound: boolean = false;
  cancelBookingId: any;
  textAfter90min: boolean = false;
  servicedate: any;
  servicetime: any;
  currentDate: Date = new Date();
  amount: number = 100;
  statusText: string = 'Cancelling your booking Please Wait'
  cancel_reason: any;
  cancel_other_reason: string = '';
  loading: boolean = false; 
  HeaderQyt: any;
  

  constructor(private apiservice: ApiService, private storage: Storage, private router: Router) {
    this.init();
  }

  async ngOnInit(){
    this.prinUpcomingBookings();
    // this.printPastBooking();
  }

  async init() {
    await this.storage.create();
  }

  
  async toggleDivs(booking_id: any, servicedate: any, servicetime: any) {
    console.log('servicedate', servicedate)
    // console.log('servicetime', servicetime)
    this.servicedate = servicedate;
    this.servicetime = servicetime;
    console.log('servicedate',this.servicedate)
    console.log('servicetime',this.servicetime)

    const currentTime = this.currentDate.toLocaleTimeString('en-GB', { hour12: false }); // Output: 12:30:00
    const currentFormattedDate = this.currentDate.toISOString().split('T')[0]; // Output: 2024-11-23

    // console.log('Current Time:', currentTime);
    // console.log('Current Date:', currentFormattedDate);
    let start = new Date(`${currentFormattedDate} ${currentTime}`);
    let end = new Date(`${this.servicedate} ${this.servicetime}`);
     console.log('start', start)
     console.log('end', end)
    // If the end date is before the start date, we add 24 hours to the end date to correctly calculate the difference
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    // Calculate the difference in milliseconds
    let diffMs = end.getTime() - start.getTime();
    let diffMinutes = Math.floor(diffMs / 60000); // 60000 milliseconds in a minute
    if(diffMinutes >= 90){
      this.textAfter90min = true;
        this.cancel_reason = '';
        console.log('you can cancel the booking');
    } else{
      this.textAfter90min = false;
      this.cancel_reason = 7;
      this.cancel_other_reason = 'charge amount of 10%';
       console.log('you can cancel the booking with the charging amount of 10%')
    }
    // return diffMinutes;
   

    await this.storage.set('servicedate', servicedate);
    await this.storage.set('servicetime', servicetime);
    await this.storage.set('cancelBookingId', booking_id);
    // console.log('booking_id',booking_id)
    this.showFirstDiv = !this.showFirstDiv;  // Toggle between true and false
  }
  backTObooking(){
    this.showFirstDiv = true;
  }
  proceed(){
    this.confirmbooking = false;
    this.showFirstDiv = true;
    this.cancelBooking();
    // setTimeout(() => {
    //   this.statuscheck();
    // }, 3000);
  }

  statuscheck(){
    this.showFirstDiv = true;
    this.confirmbooking =true;
    // this.showCancelStatus= false;
  } 

  async prinUpcomingBookings(){
    const user_id = await this.storage.get('user_index_id');
    this.loading = true;
    this.apiservice.upComingBookings(user_id).subscribe((response)=>{
      if(response.status === true){
       
        this.upComingBookingData = response.message;
         console.log('response upcoming bookings', response)
      } else if(response.status === false){
        this.noUpcomingFound = true;
        console.log('no up coming booking')
      }
      this.loading = false;
    })
  }

  async printPastBooking(){
    const user_id = await this.storage.get('user_index_id');
    this.loading = true;
   
    this.apiservice.pastbookings(user_id).subscribe((response)=>{
      if(response.status === true){
        this.pastBooking = response.message;
        console.log('past booking', response);
      } else if (response.status === false){
        this.noDataFound = true;
      }
      this.loading = false;
    })
  }

  onclickPastBooking(){
  this.noUpcomingFound = false;
   this.showUpcommingBooking = false;
   this.printPastBooking();
  }

  onclickUpComingBooking(){  
    this.prinUpcomingBookings();
    this.showUpcommingBooking = true;
    this.showFirstDiv = true;
    this.confirmbooking =true;
    this.noDataFound = false;
  }

  setActiveButton(button: string) {
    this.activeButton = button; // Set the clicked button as active
    if (button === 'upcoming') {
      this.onclickUpComingBooking();
    } else if (button === 'past') {
      this.onclickPastBooking();
    }
  }
   navigateToTab2Page(){
    window.location.reload();
  }
  async cancelBooking(){
    console.log('cancel booking')
    this.cancelBookingId = await this.storage.get('cancelBookingId');
    const booking_id = this.cancelBookingId;
    const cancel_other_reason = this.cancel_other_reason;
    const cancel_reason = this.cancel_reason;
    this.apiservice.cancelBooking(booking_id, cancel_reason, cancel_other_reason).subscribe((response)=>{
      if(response.status === true){
          this.statusText = 'Booking Cancelled';
          this.navigateToTab2Page();
         console.log('cancel booking response', response);
      } else{

      }
    })
  }

    increaseQuantity() {
    const prev_cart_data = localStorage.getItem('cart');
    const previousCart = prev_cart_data ? JSON.parse(prev_cart_data) : [];

    const newCartItem = {
        id: 91,
        name: "Relaxation Massage",
        quantity: 1, // New item starts with quantity 1
        duration: "90 min",
        services_id: "20",
        totalAmount: 299,
        services_variants_id: "91",
        unitAmount: 299,
        booking_type: 'service', // Adjust this according to your requirement
        user_id: 1136,
        service_category: "7",
        duration_number: 90,
        service_type: "Relaxation",
    };

    // Push the new cart item into the cart array
    previousCart.push(newCartItem);

    // Save the updated cart back to local storage
    localStorage.setItem('cart', JSON.stringify(previousCart));

    // Optionally, update the UI or other states
    // this.updateTotalAmount(index);
    // this.cdr.detectChanges();
}


  // reBook(service_name: any,service_variant: any,service_category: any,services_name: any, sv_duration_time: any, total_price: any, sv_people: any){
  //   //  console.log('service_variant',service_variant)    
  //    const duration = Number(sv_duration_time)
  //   //  console.log('duration',duration)
  //   //  this.saveCart(service_variant,service_name,service_category,services_name);
  //   const prev_cart_data = localStorage.getItem('cart');
  //   const previousCart = prev_cart_data ? JSON.parse(prev_cart_data) : [];
  //   const existingServiceTypes = [...new Set(previousCart.map((item: { service_type: any; }) => item.service_type))];
  //   if(sv_people>1)
  //   {
  //     sv_people = 'single'
  //   }else{
  //     sv_people = 'Couple'
  //   }
  //   const newCartItem = {
  //       id: service_variant,
  //       name: services_name,
  //       quantity: 1, // New item starts with quantity 1
  //       duration: sv_duration_time+ 'min',
  //       services_id: "20",
  //       totalAmount: total_price,
  //       services_variants_id: service_variant,
  //       unitAmount: total_price,
  //       booking_type: sv_people, // Adjust this according to your requirement
  //       user_id: 1136,
  //       service_category: "7",
  //       duration_number: duration,
  //       service_type: sv_people,
  //   };
    
    
  //   // Push the new cart item into the cart array
  //   previousCart.push(newCartItem);
  //   // Save the updated cart back to local storage
  //   localStorage.setItem('cart', JSON.stringify(previousCart));

  //   const prev_cart_data2 = localStorage.getItem('cart');
  //   const cartLength = prev_cart_data2 ? JSON.parse(prev_cart_data2).length : 0;
  //   console.log('prev_cart_data2',prev_cart_data2)
  //   if (prev_cart_data) {
  //     const cartItems = JSON.parse(cartLength);
  //     console.log('prevois cart', cartItems)
  //     // const cart_len = cartItems.length;
  //     console.log(cartItems);
  //     if(cartItems != 0){
  //       console.log(cartItems);
  //       this.HeaderQyt = cartItems;

  //       localStorage.setItem('headerCart',  this.HeaderQyt);
  //     }else{
  //       this.HeaderQyt = '';
  //       localStorage.setItem('headerCart',  this.HeaderQyt);
  //     }
     
  //   } else {
  //     this.HeaderQyt = '';
  //   }
  //   // Optionally, update the UI or other states
  //   // this.updateTotalAmount(index);
  //   // this.cdr.detectChanges();
  // }
 async reBook(
    service_name: any,
    service_variant: any,
    service_category: any,
    services_name: any,
    sv_duration_time: any,
    total_price: any,
    sv_people: any
  ) {
    const user_id = await this.storage.get('user_index_id');
    const duration = Number(sv_duration_time);
  
    const prev_cart_data = localStorage.getItem('cart');
    const previousCart = prev_cart_data ? JSON.parse(prev_cart_data) : [];
  
    // Calculate total duration of existing items in the cart
    const totalDurationFromPrevious = previousCart.reduce(
      (sum: number, item: { duration_number: number }) => sum + Number(item.duration_number),
      0
    );
  
    // Calculate the new total duration if this item is added
    const totalDuration = totalDurationFromPrevious + duration;
  
    // Check if the total duration exceeds 180 minutes
    if (totalDuration > 180) {
      alert('Adding this service exceeds the maximum booking duration of 180 minutes.');
      return; // Prevent further execution if duration exceeds limit
    }
  
    const currentBookingType = sv_people > 1 ? 'Couple' : 'single';

    // Check if a 'couple' or 'single' booking is already in the cart
    const hasSingle = previousCart.some((item: { booking_type: string }) => item.booking_type === 'single');
    const hasCouple = previousCart.some((item: { booking_type: string }) => item.booking_type === 'Couple');
  
    // Restrict adding a 'single' booking if there's already a 'couple' booking in the cart
    if (currentBookingType === 'single' && hasCouple) {
      alert("Cannot add a 'single' booking as there is already a 'couple' booking in the cart.");
      return; // Prevent adding the 'single' booking
    }
  
    // Restrict adding a 'couple' booking if there's already a 'single' booking in the cart
    if (currentBookingType === 'Couple' && hasSingle) {
      alert("Cannot add a 'couple' booking as there is already a 'single' booking in the cart.");
      return; // Prevent adding the 'couple' booking
    }
    if (sv_people === '1') {
      sv_people = 'single';
    } else {
      sv_people = 'Couple';
    }
    const newCartItem = {
      id: service_variant,
      name: services_name,
      quantity: 1, // New item starts with quantity 1
      duration: sv_duration_time + 'min',
      services_id: service_name,
      totalAmount: total_price,
      services_variants_id: service_variant,
      unitAmount: total_price,
      booking_type: sv_people, // Adjust this according to your requirement
      user_id: user_id,
      service_category: service_category,
      duration_number: duration,
      service_type: sv_people,
    };
  
    // Push the new cart item into the cart array
    previousCart.push(newCartItem);
  
    // Save the updated cart back to local storage
    localStorage.setItem('cart', JSON.stringify(previousCart));
  
    const cartLength = previousCart.length;
    console.log('Updated Cart:', previousCart);
    localStorage.setItem('cart', JSON.stringify(previousCart));

    let total = previousCart.reduce((accumulator: number, item: { totalAmount: number }) => {
      return accumulator + Number(item.totalAmount);
    }, 0);
    console.log(total)
    // Store the total in localStorage
    localStorage.setItem('overallTotalAmount', total.toString());

    // if(total == 0){
    //   this.showcart = false;
    // }
    // this.overallTotalAmount = total;
    if (cartLength !== 0) {
      this.HeaderQyt = cartLength.toString();
      localStorage.setItem('headerCart', this.HeaderQyt);
    } else {
      this.HeaderQyt = '';
      localStorage.setItem('headerCart', this.HeaderQyt);
    }
  }
  
}


