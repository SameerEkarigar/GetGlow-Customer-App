import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { ApiService } from '../services/api.service';
import { LoadingServiceService } from '../services/loading-service.service';
import { firstValueFrom } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
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


  constructor(private router: Router, private apiservice: ApiService, private loadingService: LoadingServiceService,private storage: Storage) {
     this.init();
  }

  ngOnInit() {
    this.loadData();
  }
  async init() {
    await this.storage.create();
  }
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

  openServiceDetails(service_category: any, category_name: any) {
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
        console.log('packages-',this.packagesData);     
      }
    })
  }

 async onClickPackages(service_category: any, category_name: any, service_name: any, static_name: any ){
    await this.storage.set('service_name', service_name);
    await this.storage.set('static_name', static_name);
    this.router.navigate(['/spa-ladies', service_category, category_name]); 
  }
  
  addButton: boolean = false;
  quantities: number[] = [];
    // Method to increase quantity
    increaseQuantity(index: number) {
      this.quantities[index]++;
    }
  
    // Method to decrease quantity
    decreaseQuantity(index: number) {
      if (this.quantities[index] > 0) {
        this.quantities[index]--;
      }
    }
  
    // Method to toggle the add button (if needed)
    ShowAddbutton(index: number) {
      this.addButton = true;
      this.quantities[index] = 1; // Set initial quantity when "Add" is clicked
    }
}
