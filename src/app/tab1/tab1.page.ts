import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { ApiService } from '../services/api.service';
import { LoadingServiceService } from '../services/loading-service.service';
import { firstValueFrom } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { ChangeDetectorRef } from '@angular/core';

register();

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  data: any;
  OfferData: any;
  searchText: string = '';
  spa_lady_banner: any;
  PrintService1: any;
  blocks: any[] = [];
  printService2: any[] = [];
  printService3: any;
  mostPopularData: any;
  OrderPrint: any[] = [];
  categoryName1: any;
  categoryName2: any;
  categoryName3: any;
  data_0: any;
  OfferData_1: any;
  mostPopularData_1: any;
  loading: boolean = false; // Loading state
  packagesData: any[]=[];

  addButton: boolean = false;
  showcart: boolean = false;
  user_id: any;
  totalAmount: number = 0;
  overallTotalAmount: any;
  HeaderQyt: any = '';


  constructor(private router: Router, private apiservice: ApiService, private loadingService: LoadingServiceService,private storage: Storage, private cdr: ChangeDetectorRef,) {
     this.init();
  }

 async ngOnInit() {
    const check= await this.storage.set('tap_id','');
    console.log('check', check);
    this.loadData();
    this.user_id = await this.storage.get('user_index_id');
    this.CalculateHeaderItem();
  }

  async init() {
    await this.storage.create();
  }

  // ionViewWillEnter() {
  //   //console.log('ionViewWillEnter - Runs every time the page is entered');
  //   this.navigateToTabPage(); // Reload cart data each time user navigates to this page
  // }
  // navigateToTabPage(){
  //   this.router.navigate(['/tabs/tab1']);
  // }
  // Method to load all data and manage loading state
  async loadData() {
    this.loading = true; // Start loading

    try {
      // Call the methods to load data
      await this.printServiceData();
      await this.printPackages();
      await this.printOfferData();
      await this.printBannerImg();
      await this.printService1data();
      await this.printService2data();
      await this.printService3data();
      await this.printMostPopularService();
      await this.printOrder();
      
    } finally {
      this.loading = false; // Stop loading after data is loaded
    }
  }

  swiperSlideChanged(e: any) {
    // Handle swiper slide changes if needed
  }

  navigateToSpapage() {
    this.router.navigate(['/spa-ladies']);
  }

  async openServiceDetails(service_category: any, category_name: any) {
    await this.storage.set('ItemType', 'service');
    this.router.navigate(['/spa-ladies', service_category, category_name]); // Navigate to spa-ladies page with the service id
  }

  async printServiceData() {
    try {
      const response = await firstValueFrom(this.apiservice.getSeriveName());
      if (response.status === true) {
        const serviceData = response.data;
        this.data_0 = response.data[0];
        this.data = serviceData;
      }
    } catch (error) {
      console.error('Error fetching service data:', error);
    }
  }

  async printOfferData() {
    try {
      const response = await firstValueFrom(this.apiservice.getOfferData());
      if (response.status === true) {
        const offerData = response.data;
        this.OfferData_1 = response.data[0];
        this.OfferData = offerData;
      }
    } catch (error) {
      console.error('Error fetching offer data:', error);
    }
  }

  async printBannerImg() {
    try {
      const response = await firstValueFrom(this.apiservice.getBannerImg());
      if (response.status === true) {
        const home_data = response.data[0];
        this.spa_lady_banner = home_data.image_name;
      }
    } catch (error) {
      console.error('Error fetching banner image:', error);
    }
  }

  async printService1data() {
    try {
      const service1data = await firstValueFrom(this.apiservice.getService1());
      if (service1data.status === true) {
        this.PrintService1 = service1data.data.map((service1: { sv_name: string }) => {
          if (service1.sv_name) {
            const parts = service1.sv_name.split('-');
            if (parts.length > 1) {
              service1.sv_name = parts[1].trim();
            }
          }
          return service1;
        });
        this.categoryName1 = this.PrintService1[0].category_name;
       
      }
    } catch (error) {
      console.error('Error fetching service 1 data:', error);
    }
  }

  async printService2data() {
    try {
      const service2data = await firstValueFrom(this.apiservice.getService2());
      if (service2data.status === true) {
        this.printService2 = service2data.data;
        this.categoryName2 = this.printService2[0].category_name;
      }
    } catch (error) {
      console.error('Error fetching service 2 data:', error);
    }
  }

  async printService3data() {
    try {
      const service3data = await firstValueFrom(this.apiservice.getService3());
      if (service3data.status === true) {
        this.printService3 = service3data.data;
        this.categoryName3 = this.printService3[0].category_name;
      }
    } catch (error) {
      console.error('Error fetching service 3 data:', error);
    }
  }

  async printMostPopularService() {
    try {
      const mostpopular = await firstValueFrom(this.apiservice.getMostPopularService());
      if (mostpopular.status === true) {
        this.mostPopularData = mostpopular.data;
        this.mostPopularData_1 = mostpopular.data[0];
        // console.log('Most Popular Data-', this.mostPopularData);

        const storedCartString = localStorage.getItem('cart') || '[]';

        let storedCart;
  
        try {
          storedCart = JSON.parse(storedCartString);
        } catch (error) {
          // console.error('Error parsing stored cart data:', error);
          storedCart = []; 
        }
  
        if (Array.isArray(storedCart)) { 
          this.mostPopularData.forEach((variant: { id: any; quantity: any; addButton: boolean; totalAmount: any; }) => {
            const storedItem = storedCart.find((item: any) => item.id === variant.id);
            if (storedItem) {
              variant.quantity = storedItem.quantity;
              variant.addButton = true;
              variant.totalAmount = storedItem.totalAmount;
            }
          });
        } else {
          console.warn('Stored cart data is not an array:', storedCart);
        }

      }
    } catch (error) {
      console.error('Error fetching most popular services:', error);
    }
  }

  async printOrder() {
    try {
      const response = await firstValueFrom(this.apiservice.getOrderApi());
      if (response.message) {
        this.OrderPrint = response.message;
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  }

  printPackages(){
    this.apiservice.packages().subscribe((response)=>{
      if(response.status === true){
        this.packagesData = response.message;
        //console.log('packages-',this.packagesData);     
      }
    })
  }

  async onClickPackages(service_category: any, name: any, service_name: any, static_name: any, service_category_name: any ){
    await this.storage.set('service_name', service_name);
    await this.storage.set('ItemType', static_name);
    this.router.navigate(['/spa-ladies', service_category, service_category_name]); 
  }
  
    // Method to increase quantity
  increaseQuantity(index: number) {
      // this.quantities[index]++;
      this.mostPopularData[index].quantity++
      this.updateTotalAmount(index);
      this.saveCart();
      this.cdr.detectChanges();
     
    }
  
  decreaseQuantity(index: number) {
      if (this.mostPopularData[index].quantity > 1) {
        this.mostPopularData[index].quantity -= 1;
        this.CalculateHeaderItem();
        this.updateTotalAmount(index);
        this.saveCart();   
        this.cdr.detectChanges(); 
  
      } else if(this.mostPopularData[index].quantity === 1){
        const this_item = this.mostPopularData[index]['id'];

        const check_cart = localStorage.getItem('cart');
          if (check_cart) {
              let cartItems = JSON.parse(check_cart);
              // Filter out the item that matches this_item id
              cartItems = cartItems.filter((item: { id: any }) => item.id !== this_item);
              // Save the updated cart back to localStorage
              localStorage.setItem('cart', JSON.stringify(cartItems));
          }

        this.mostPopularData[index].quantity = 0;  // Set quantity to 0
        this.mostPopularData[index].totalAmount = 0; // Reset total amount to 0 for this item
        this.mostPopularData[index].addButton = true;
        this.CalculateHeaderItem();   
        this.updateOverallTotalAmount();
        this.saveCart();
        this.cdr.detectChanges(); 
      }
    }
  
  ShowAddbutton(index: number) {
      // Extract the new service type and duration dynamically
      const newServiceType = this.mostPopularData[index].sv_name.split(' - ')[0].trim();
      const newDurationNumber = this.mostPopularData[index].sv_duration_time;
  
      // Retrieve previous cart data
      const prev_cart_data = localStorage.getItem('cart');
      const previousCart = prev_cart_data ? JSON.parse(prev_cart_data) : [];
  
      const existingServiceTypes = [...new Set(previousCart.map((item: { service_type: any; }) => item.service_type))];
      const hasConflict = existingServiceTypes.length > 0 &&
                          !existingServiceTypes.includes(newServiceType);
  
      if (hasConflict) {
          alert(`This service cannot be added. There are already services of type: ${existingServiceTypes.join(', ')} in your cart.`);
          return; // Exit early to prevent UI updates
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



      this.mostPopularData[index].addButton = true;   
      this.mostPopularData[index].quantity = 1;  
      this.updateTotalAmount(index);  
      this.showcart = true;  
      // const prev_cart_data = localStorage.getItem('cart');
      // const previousCart = prev_cart_data ? JSON.parse(prev_cart_data) : [];
      this.saveCart();
      this.CalculateHeaderItem();
      
  }

  updateTotalAmount(index: number){
      const variant1 = this.mostPopularData[index]; 
      if (variant1) {      
          variant1.totalAmount = variant1.quantity * variant1.sv_price;
      }
    }

  async updateOverallTotalAmount() {
      const check_cart = localStorage.getItem('cart');
      if (check_cart) {
          const cartItems = JSON.parse(check_cart);
  
          let total = cartItems.reduce((accumulator: number, item: { totalAmount: number }) => {
            return accumulator + item.totalAmount;
          }, 0);
          
          // Store the total in localStorage
          localStorage.setItem('overallTotalAmount', total.toString());
  
          if(total == 0){
            this.showcart = false;
          }
          this.overallTotalAmount = total;
          
      } else {
          this.overallTotalAmount = 0;
      }
  
      this.cdr.detectChanges();
    }
    
  saveCart(){
      const prev_cart_data = localStorage.getItem('cart');
      let previousCart = prev_cart_data ? JSON.parse(prev_cart_data) : [];
      
      const existingServiceTypes = [...new Set(previousCart.map((item: { service_type: any; }) => item.service_type))];

      const newCartItems = this.mostPopularData.filter((mostPopularVariant: { addButton: any; quantity: number; }) => mostPopularVariant.addButton && mostPopularVariant.quantity > 0)
      .map((mostPopularVariant:{
        services_variants_id : number,
        name: any,
        sv_duration: any,
        sv_price: any,
        service_category: any,
        totalAmount: any,
        quantity: any,
        sv_name: any,
        id: any,
        sv_duration_time: any,
        services_id: any
        
        })=>({
          id: mostPopularVariant.id,
          services_variants_id : mostPopularVariant.services_variants_id,
          name: mostPopularVariant.name,
          duration: mostPopularVariant.sv_duration,
          duration_number: mostPopularVariant.sv_duration_time,
          unitAmount: mostPopularVariant.sv_price,
          totalAmount : mostPopularVariant.totalAmount,
          booking_type: 'mostPopularService',
          service_category: mostPopularVariant.service_category,
          user_id: this.user_id,
          quantity: mostPopularVariant.quantity,
          service_type: mostPopularVariant.sv_name.split(' - ')[0].trim(),
          services_id: mostPopularVariant.services_id

        }));
        
        const newServiceTypes = [...new Set(newCartItems.map((item: { service_type: any; }) => item.service_type))];
        const hasConflict = existingServiceTypes.length > 0 &&
                            !newServiceTypes.every(type => existingServiceTypes.includes(type));
  
        if (hasConflict) {
            alert(`This service cannot be added. There are already services of type: ${existingServiceTypes.join(', ')} in your cart.`);
            return;
        }
  
        const totalDurationFromPrevious = previousCart.reduce(
            (sum: number, item: { duration_number: any }) => sum + Number(item.duration_number), 0
        );
  
        const totalDurationFromNew = newCartItems.reduce(
            (sum: number, item: { duration_number: any }) => sum + Number(item.duration_number), 0
        );
  
        const totalDuration = totalDurationFromPrevious + totalDurationFromNew;
  
        if (totalDurationFromNew > 180) {
            alert(`We are unable to set a maximum massage duration of 180 minutes.`);
            return; // Exit early to prevent saving the cart
        }

        newCartItems.forEach((newItem: { id: any; quantity: any; totalAmount: any; }) => {
          const existingItem = previousCart.find((item: { id: any; }) => item.id === newItem.id);
          if (existingItem) {
              existingItem.quantity = newItem.quantity; // Update quantity
              existingItem.totalAmount = newItem.totalAmount; // Update total amount
          } else {
              previousCart.push(newItem); // Add new item if not found in the previous cart
          }
      });

          localStorage.setItem('cart', JSON.stringify(previousCart));

          let total = previousCart.reduce((accumulator: number, item: { totalAmount: number }) => {
            return accumulator + item.totalAmount;
          }, 0);
    
          localStorage.setItem('overallTotalAmount', total.toString());
    
          if(total == 0){
            this.showcart = false;
          }
          this.overallTotalAmount = total;

          const cart_length = previousCart.length;
          //console.log(cart_length);
          if(cart_length != 0){
            this.HeaderQyt = cart_length;
            localStorage.setItem('headerCart',  this.HeaderQyt);
          }else{
            this.HeaderQyt = '';
            localStorage.setItem('headerCart',  this.HeaderQyt);
          }
    }
    
  CalculateHeaderItem(){
      const prev_cart_data = localStorage.getItem('cart');
      if (prev_cart_data) {
        const cartItems = JSON.parse(prev_cart_data);
        const cart_len = cartItems.length;
        if(cart_len != 0){
          this.HeaderQyt = cart_len;
          localStorage.setItem('headerCart',  this.HeaderQyt);
        }else{
          this.HeaderQyt = '';
        }
       
      } else {
        this.HeaderQyt = '';
      }
    }

    navigateToViewBooking(){
      this.router.navigate(['/view-booking']);
    }
}
