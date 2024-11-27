import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { PopupserviceService } from '../services/popupservice.service';
import { ApiService } from '../services/api.service';
import { KnowMoreModalComponent } from '../myComponents/know-more-modal/know-more-modal.component';
import { forkJoin } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-spa-ladies',
  templateUrl: './spa-ladies.page.html',
  styleUrls: ['./spa-ladies.page.scss'],
})

export class SpaLadiesPage implements OnInit {
 
  showcart: boolean = false;

  services: Service[] = [
    { duration: '60 mins', price: 165, quantity: 0, isExpanded: false },
    { duration: '90 mins', price: 220, quantity: 0, isExpanded: false },
  ];

  // divContent: any;
  addButton: boolean = false;
  showModal: boolean = false;
  static_btn: boolean = false;
  isExpanded: boolean[] = [false, false];
  quantities: number[] = [0, 0];
  isToastVisible: boolean = false;
  servicecategory: any;
  selectedService: any;
  servicesArray: string[] = [];
  serviceNamesArray: string[] = [];
  variantSvName: string[] = [];
  serviceImgbanner: any;
  SV_data: any;
  variantData: any[]=[];
  variantData1: any;
  activeIndex: number | null = null;
  matchServiceId: any;
  isModalOpen = false; 
  modalData: any; 
  presentingElement: any = null;
  whatWeGet: any;
  selectedVariants: any[] = [];
  printlocolStorage: any;
  varient_id: string = '';
  pre_fetched_data: any = [];
  storedCartString: any = [];
  cart: any = [];
  user_id: any;
  HeaderQyt: any = '';
  category_name:  any;
  sv_people: any;
  packages: any;
  printPackageVariant: any;
  service_name: any[]= [];
  showpackages: boolean = false;
  ItemType: any;
  
  constructor(
    private router: Router,
    private popupService: PopupserviceService,
    private modalController: ModalController,
    private toastController: ToastController,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private Storage: Storage
    
  ) {
     this.init();
  }

  async init() {
    await this.Storage.create();
  }
  
  refreshPage() {
    window.location.reload();
  }

  async ionViewWillEnter() {
    // This will run every time you navigate to this page
    // this.refreshPage();
    // //console.log('ionViewWillEnter called');
    const ItemType = await this.Storage.get('ItemType');
    // //console.log('ItemType-',ItemType)
    if(ItemType === 'service'){
      this.showpackages = false;
    }else{
      this.showpackages = true;
    }
  }
 
  async ngOnInit() {

    const index = 0; // Set the appropriate index if needed
    const service_name = await this.Storage.get('service_name'); // Replace with the actual service name or variable
    this.onclickpackageServiceName(null, index, service_name);

    this.printPackagesServices();
    this.CalculateHeaderItem();
    localStorage.setItem('spa_ladies_url', '');
    localStorage.setItem('spa_ladies_url_1', '');
    localStorage.setItem('spa_ladies_url_2', '');

    this.user_id = await this.Storage.get('user_index_id');
    this.service_name = await this.Storage.get('service_name');

    // this.get_quantity_length();
    this.category_name = this.route.snapshot.paramMap.get('category_name');
    this.servicecategory = this.route.snapshot.paramMap.get('service_category');

    await this.Storage.set('service_category', this.servicecategory);

    this.updateOverallTotalAmount();

    if(this.overallTotalAmount == 0){
      this.showcart = false;
    }else{
      this.showcart = true;
    }

    this.runDeductQuantityOnPageLoad();
    this.presentingElement = document.querySelector('.modalpage');
    this.servicecategory = this.route.snapshot.paramMap.get('service_category');
  
    this.apiService.getSeriveName().subscribe(response => {
      const services = response.data;
      this.selectedService = services.find((service: { service_category: any; }) => service.service_category === this.servicecategory);
      if (this.selectedService) {
        this.servicesArray = this.selectedService.names_of_services.split(',').map((service: string) => service.trim());
        this.serviceNamesArray = this.selectedService.service_name.split(',').map((name: string) => name.trim());
        this.activeIndex = 0;
        this.matchServiceId = this.serviceNamesArray[0];
        this.fetchInitialData(this.serviceNamesArray[0]);
        this.serviceImgbanner = this.selectedService.image_name;     
      }
    });
  }


  async openModal(services_id: string) {
    forkJoin({
      serviceData: this.apiService.getWhatWeGetContent(services_id),
      wahtIncludeData: this.apiService.getWhatWeIncludeService(services_id),
      servicePageDescription: this.apiService.getServicePageDescription(services_id),
      featuresData: this.apiService.getfeatureApi(services_id),
      ourProfVideoData: this.apiService.getOurProfessionalVideo(services_id),
      whatincludeData: this.apiService.getWhatIncludeSection(services_id),
      getBeforeYoubookData: this.apiService.getBeforeYoubookData(services_id)        // Add more API calls as needed
      

    }).subscribe(async ({ serviceData, wahtIncludeData, servicePageDescription, featuresData, ourProfVideoData, whatincludeData, getBeforeYoubookData }) => {       
      if (serviceData && wahtIncludeData && servicePageDescription && featuresData && ourProfVideoData && whatincludeData && getBeforeYoubookData) {
        const servicePageDescriptionallIndex = this.allIndexService(servicePageDescription.message);
        const modal = await this.modalController.create({
          component: KnowMoreModalComponent,
          componentProps: {
            serviceData: serviceData.message[0], // Pass first API response
            wahtIncludeData: wahtIncludeData.message[0], // Pass second API response
            servicePageDescription: servicePageDescription.message[0], 
            servicePAgeDEscriptionArray: servicePageDescriptionallIndex,// Pass third API response
            featuresData: featuresData.message[0],
            ourProfVideoData: ourProfVideoData.message[0],
            whatincludeData: whatincludeData.message[0],
            getBeforeYoubookData: getBeforeYoubookData.message[0],// Pass more data if needed
            serviceId: services_id // Optionally pass the service_id
          },
          presentingElement: this.presentingElement,
          cssClass: 'custom-modal-class'
        });
        return await modal.present();
      }
    });
  }
  // ---

  async openpackageModal(services_variants: any) {
    // console.log(services_variants)
    forkJoin({
        service_type: 'pacakge',
        packageInnerDescription : this.apiService.packageInnerDescription(services_variants),
        packageFeatureData: this.apiService.packageInnerFeatures(services_variants),
        packageInnerVideo: this.apiService.packageInnerVideo(services_variants),
        packageInnerWhatWeGet: this.apiService.packageInnerWhatWeGet(services_variants),
        packageInnerWhatWeInclude: this.apiService.packageInnerWhatWeInclude(services_variants),
        packageInnerBeforeYouBook: this.apiService.packageInnerBeforeYouBook(services_variants)
      // serviceData: this.apiService.getWhatWeGetContent(services_id),
      // wahtIncludeData: this.apiService.getWhatWeIncludeService(services_id),
      // servicePageDescription: this.apiService.getServicePageDescription(services_id),
      // featuresData: this.apiService.getfeatureApi(services_id),
      // ourProfVideoData: this.apiService.getOurProfessionalVideo(services_id),
      // whatincludeData: this.apiService.getWhatIncludeSection(services_id),
      // getBeforeYoubookData: this.apiService.getBeforeYoubookData(services_id)        // Add more API calls as needed
      

    }).subscribe(async ({service_type, packageInnerDescription, packageFeatureData,packageInnerVideo,packageInnerWhatWeGet,packageInnerWhatWeInclude, packageInnerBeforeYouBook }) => {       
      if (service_type && packageInnerDescription && packageFeatureData && packageInnerVideo && packageInnerWhatWeGet && packageInnerWhatWeInclude && packageInnerBeforeYouBook) {
        
        const modal = await this.modalController.create({
          component: KnowMoreModalComponent,
          componentProps: {
            service_type:'package',
            packageInnerDescription: packageInnerDescription.message[0], // Pass first API response
            packageFeatureData: packageFeatureData.message[0],
            packageInnerVideo: packageInnerVideo.message[0],
            packageInnerWhatWeGet: packageInnerWhatWeGet.message[0],
            packageInnerWhatWeInclude: packageInnerWhatWeInclude.message[0],
            packageInnerBeforeYouBook: packageInnerBeforeYouBook.message[0] // Pass second API response
            
          // Pass third API response
        
          },
          presentingElement: this.presentingElement,
          cssClass: 'custom-modal-class'
        });
        return await modal.present();
      }
    });
  }

// -----


  ionViewDidEnter() {
    this.runDeductQuantityOnPageLoad();
  }

  runDeductQuantityOnPageLoad() {

     const check_cart = localStorage.getItem('cart');
      if (!check_cart || this.variantData.length === 0) {
        // Only deduct if cart or variantData is empty (first load or no items in cart)
        this.variantData.forEach((data, index) => {
          if (data.quantity > 1) {
            this.deductQuantity(index); 
          }
        });
      }
  }

  private allIndexService(descriptionArray: any[]): any[] {
    return descriptionArray.map(item => {
      return {
        ...item,
        splitSvName: item.sv_name.split(' - ')[0]
      };
    });
  }
  
  async closeModal() {
    await this.modalController.dismiss();
  }

  fetchInitialData(serviceName: string) {
    
    this.apiService.getServiceVariant(serviceName).subscribe((response) => {
      if (response) {
        this.variantData1 = response.message[0];
        this.variantData = response.message;
        console.log('service variant data : ',this.variantData);
        const storedCartString = localStorage.getItem('cart') || '[]';

        let storedCart;
  
        try {
          storedCart = JSON.parse(storedCartString);
        } catch (error) {
          // console.error('Error parsing stored cart data:', error);
          storedCart = []; 
        }
  
        if (Array.isArray(storedCart)) { 
          this.variantData.forEach(variant => {
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
  
        const varient_id = this.variantData1.id;
        this.apiService.addTocart(varient_id).subscribe(response => {
          if (response.status == true) {
            this.pre_fetched_data = response.message;
          }
        });
      }
    });
  }

  onclickService(event: any, i: number) {
    const serviceName = event.target.getAttribute('data-service');
    this.activeIndex = i;
    this.matchServiceId = serviceName;
    this.fetchInitialData(serviceName);
  }

  changeToactive(index: number) {
    this.activeIndex = index;
  }

  overallTotalAmount: number = 0;
  quantity: number = 1;
  totalAmount: number = 0;

  printPackagesServices(){
    this.servicecategory = this.route.snapshot.paramMap.get('service_category');
    const packages_service_category = this.servicecategory;
    this.apiService.packagesInnerData(packages_service_category).subscribe((response)=>{
      if(response.status === true){
        this.packages = response.message; 
        //  //console.log('packages inner data',response);
      }
    })

  }
 
 async showAddButtons(index: number, event: any) {
    const ItemType = await this.Storage.get('ItemType');
      if(ItemType === 'packages'){
        // const newServiceType = this.printPackageVariant[index].services_variants_name.split(' - ')[0].trim();
        const newServiceType = 'Package';
        const newDurationNumber = this.printPackageVariant[index].package_duration;
    
        // Retrieve previous cart data
        const prev_cart_data = localStorage.getItem('cart');
        const previousCart = prev_cart_data ? JSON.parse(prev_cart_data) : [];
    
        const existingServiceTypes = [...new Set(previousCart.map((item: { service_type: any; }) => item.service_type))];
        // //console.log('existingServiceTypes',existingServiceTypes)
        const hasConflict = existingServiceTypes.length > 0 &&
                            !existingServiceTypes.includes(newServiceType);
        if (hasConflict) {
            alert(`This Packages cannot be added. There are already services of type: ${existingServiceTypes.join(', ')} in your cart.`);
            return; // Exit early to prevent UI updates
        }
    
        this.printPackageVariant[index].addButton = true;
        this.printPackageVariant[index].quantity = 1;
        this.updateTotalAmount(index);

        this.showcart = true;

        this.saveCart();
        // this.updateOverallTotalAmount();
        // this.CalculateHeaderItem();

        this.cdr.detectChanges();

      } else {

        // //console.log('Services');
        const newServiceType = this.variantData[index].sv_name.split(' - ')[0].trim();
        
        const newDurationNumber = this.variantData[index].sv_duration_time;
        // Retrieve previous cart data
        const prev_cart_data = localStorage.getItem('cart');
        const previousCart = prev_cart_data ? JSON.parse(prev_cart_data) : [];

        const existingServiceTypes = [...new Set(previousCart.map((item: { service_type: string }) => item.service_type))];
        // //console.log('step 3 : ',existingServiceTypes);
        // Step 4: Check if the new service type conflicts with the existing service types
        const hasConflict = existingServiceTypes.length > 0 && !existingServiceTypes.includes(newServiceType);
        // //console.log('step 4 : ',hasConflict);
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

        this.variantData[index].addButton = true;
        this.variantData[index].quantity = 1;
        this.updateTotalAmount(index);
    
        const selectedVariant = {
            name: newServiceType,
            duration: newDurationNumber,
            totalAmount: this.variantData[index].totalAmount
        };
    
        this.selectedVariants.push(selectedVariant);
        this.showcart = true;
    
        // Save the current state of the cart to localStorage
        this.saveCart();
        // this.updateOverallTotalAmount();
        // this.CalculateHeaderItem();
    
        // Trigger change detection to ensure the UI reflects the changes immediately
        this.cdr.detectChanges();

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
        localStorage.setItem('headerCart',  this.HeaderQyt);
      }
     
    } else {
      this.HeaderQyt = '';
    }
  }

  async saveCart() {
    const ItemType = await this.Storage.get('ItemType');
    if(ItemType === 'packages'){

      // Packages item rules 
      const prev_cart_data = localStorage.getItem('cart');
      let previousCart = prev_cart_data ? JSON.parse(prev_cart_data) : [];
      
     // //console.log('package Variant',this.printPackageVariant);
      const newCartItems = this.printPackageVariant
      .filter((variant: { addButton: any; quantity: number; }) => variant.addButton && variant.quantity > 0) // Only save items with quantity > 0
      .map((variant: {
        ID: number;
        services_variants_name: any;
        packages_service_name: any;
        totalAmount: any;
        package_duration: any;
        quantity: any;
        package_name: any; id: any; 
      }) => ({
          id: variant.ID,
          name: variant.package_name,
          quantity: variant.quantity,
          duration: variant.package_duration,
          totalAmount: variant.totalAmount,
          services_variants_id: variant.packages_service_name,
          unitAmount: variant.totalAmount,
          booking_type: 'package',
          user_id: this.user_id,
          service_category: this.servicecategory,
          duration_number: Number(variant.package_duration),
          service_type: 'Package', // Extract service type dynamically --- variant.services_variants_name.split(' - ')[0].trim()
      }));

      newCartItems.forEach((newItem: { id: any; quantity: any; totalAmount: any; }) => {
          const existingItem = previousCart.find((item: { id: any; }) => item.id === newItem.id);
          if (existingItem) {
              existingItem.quantity = newItem.quantity; // Update quantity
              existingItem.totalAmount = newItem.totalAmount; // Update total amount
          } else {
              previousCart.push(newItem); // Add new item if not found in the previous cart
          }
      });

      // //console.log(previousCart);
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
        localStorage.setItem('headerCart', this.HeaderQyt);
      }else{
        this.HeaderQyt = '';
        localStorage.setItem('headerCart', this.HeaderQyt);
      }

    }else{
      // service item rules 
      const prev_cart_data = localStorage.getItem('cart');
      let previousCart = prev_cart_data ? JSON.parse(prev_cart_data) : [];

      const existingServiceTypes = [...new Set(previousCart.map((item: { service_type: any; }) => item.service_type))];
      // //console.log('this.variantData', this.variantData)
      const newCartItems = this.variantData
          .filter(variant => variant.addButton && variant.quantity > 0) // Only save items with quantity > 0
          .map(variant => ({
              id: variant.id,
              name: variant.name,
              quantity: variant.quantity,
              duration: variant.sv_duration,
              services_id: variant.services_id,
              totalAmount: variant.totalAmount,
              services_variants_id: variant.services_variants_id,
              unitAmount: variant.totalAmount,
              booking_type: 'service',
              user_id: this.user_id,
              service_category: this.servicecategory,
              duration_number: Number(variant.sv_duration_time),
              service_type: variant.sv_name.split(' - ')[0].trim(),
               // Extract service type dynamically
          }));

      const newServiceTypes = [...new Set(newCartItems.map(item => item.service_type))];
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

      newCartItems.forEach(newItem => {
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
      
      // Store the total in localStorage
      localStorage.setItem('overallTotalAmount', total.toString());

      if(total == 0){
        this.showcart = false;
      }
      this.overallTotalAmount = total;

      const cart_lenght = previousCart.length;
      // //console.log('djxsxd : ',cart_lenght);
      if(cart_lenght != 0){
        this.HeaderQyt = cart_lenght;
        localStorage.setItem('headerCart',  this.HeaderQyt);
      }else{
        this.HeaderQyt = '';
        localStorage.setItem('headerCart',  this.HeaderQyt);
      }

    } 
}
  
  async increaseQuantity(index: number) {

    const ItemType = await this.Storage.get('ItemType');
    if(ItemType === 'packages'){ 
      this.printPackageVariant[index].quantity++;
    }else{
      this.variantData[index].quantity++;
    }
    // Increase the quantity of the specific item
    // Update the total amount for this specific variant
    this.updateTotalAmount(index);
    this.saveCart();
    // Update the overall total amount
    // this.updateOverallTotalAmount();
    // Trigger change detection
    this.cdr.detectChanges();  // This ensures the UI updates immediately

  }


  async deductQuantity(index: number) {

    const ItemType = await this.Storage.get('ItemType');
    if(ItemType === 'packages'){ 

      const this_item = this.printPackageVariant[index]['ID'];

      if (this.printPackageVariant[index].quantity > 1) {
          this.printPackageVariant[index].quantity -= 1;
          this.updateTotalAmount(index);
          this.saveCart();
          // Update the overall total amount
          // this.updateOverallTotalAmount();
          // Trigger change detection to reflect changes in the UI
          this.cdr.detectChanges();  
      } else if (this.printPackageVariant[index].quantity === 1) {
          // If quantity is 1 and reduced to 0, remove the item from localStorage
          const check_cart = localStorage.getItem('cart');
          // //console.log('khli hone wala hai : ', check_cart);
          if (check_cart) {
              let cartItems = JSON.parse(check_cart);
              // Filter out the item that matches this_item id
              cartItems = cartItems.filter((item: { id: any }) => item.id !== this_item);
              // Save the updated cart back to localStorage
              localStorage.setItem('cart', JSON.stringify(cartItems));
          }
          // Update the current item's quantity and state
          this.printPackageVariant[index].quantity = 0;  // Set quantity to 0
          this.printPackageVariant[index].totalAmount = 0; // Reset total amount to 0 for this item
          this.printPackageVariant[index].addButton = true; // Show Add button
          // Update the overall total amount after changing the item
          
          this.updateOverallTotalAmount();
          this.saveCart();
          // this.CalculateHeaderItem();
          // Trigger change detection to ensure the UI reflects the changes immediately
          this.cdr.detectChanges();
      }

    }else{

      const this_item = this.variantData[index]['id'];

      if (this.variantData[index].quantity > 1) {
          this.variantData[index].quantity -= 1;
          this.updateTotalAmount(index);
          this.saveCart();
          // Update the overall total amount
          // this.updateOverallTotalAmount();
          // Trigger change detection to reflect changes in the UI
          this.cdr.detectChanges();  
      } else if (this.variantData[index].quantity === 1) {
          // If quantity is 1 and reduced to 0, remove the item from localStorage
          const check_cart = localStorage.getItem('cart');
          if (check_cart) {
              let cartItems = JSON.parse(check_cart);
              // Filter out the item that matches this_item id
              cartItems = cartItems.filter((item: { id: any }) => item.id !== this_item);
              // Save the updated cart back to localStorage
              localStorage.setItem('cart', JSON.stringify(cartItems));
          }
          // Update the current item's quantity and state
          this.variantData[index].quantity = 0;  // Set quantity to 0
          this.variantData[index].totalAmount = 0; // Reset total amount to 0 for this item
          this.variantData[index].addButton = true; // Show Add button
          // Update the overall total amount after changing the item
          this.updateOverallTotalAmount();
          
          this.saveCart();
          // this.CalculateHeaderItem();
          // Trigger change detection to ensure the UI reflects the changes immediately
          this.cdr.detectChanges();
      }

    }
  } 

  updateSelectedVariants(index: number) {
    const updatedVariant = {
      name: this.variantData[index].sv_name.split(' - ')[0].trim(),
      duration: this.variantData[index].sv_duration_time,
      totalAmount: this.variantData[index].totalAmount
    };
    const selectedIndex = this.selectedVariants.findIndex(variant => variant.name === updatedVariant.name);
    if (selectedIndex > -1) {
      this.selectedVariants[selectedIndex] = updatedVariant;
    }
  }
  
  async updateTotalAmount(index: number) {
    const ItemType = await this.Storage.get('ItemType');
    if(ItemType === 'packages'){
      const variant1 = this.printPackageVariant[index];
      if (variant1) {
          // Calculate the total amount based on quantity and price
          variant1.totalAmount = variant1.quantity * variant1.package_amount;
      }
    }else{
      const variant = this.variantData[index];
      if (variant) {
          // Calculate the total amount based on quantity and price
          variant.totalAmount = variant.quantity * variant.sv_price;
      }
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
  
  async navigateToTabPage(){
    const static_name = '';
    await this.Storage.set('static_name', static_name);
    this.router.navigate(['/tabs/tab1']);
  }

  async navigateToViewBooking() {
    const serviceCategory = this.route.snapshot.paramMap.get('service_category') || '';
    await this.Storage.set('service_category', serviceCategory);
    await this.Storage.set('spa_ladies_url_1', serviceCategory);
    const serviceCategoryName = this.route.snapshot.paramMap.get('category_name') || '';
    await this.Storage.set('spa_ladies_url_2', serviceCategoryName);
    // const spa_url = serviceCategory+'/'+serviceCategoryName;
    localStorage.setItem('spa_ladies_url_1', serviceCategory);
    localStorage.setItem('spa_ladies_url_2', serviceCategoryName);
    localStorage.setItem('spa_ladies_url', 'spa-ladies');
    this.router.navigate(['/view-booking'], {
      state: { variants: this.selectedVariants, overallTotal: this.overallTotalAmount,  }
    });
  }

  increment(index: number) {
    this.services[index].quantity++;
  }

  decrement(index: number) {
    if (this.services[index].quantity > 0) {
      this.services[index].quantity--;
    }

    if (this.services[index].quantity <= 0) {
      this.services[index].isExpanded = false;
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000, 
      position: 'bottom', 
    });
    toast.present();
  }

  addToCart(service: Service) {
    const toastMessage = `Added ${service.quantity} x ${service.duration} service(s) to cart for a total of AED ${(service.quantity * service.price).toFixed(2)}`;
    this.showToast(toastMessage);
  }

  onclickpackageServiceName(event: any, index: number, service_name: any){
     const packages_service_name =  service_name; 
     //console.log('packages_service_name',packages_service_name)
     this.apiService.packageVariants(packages_service_name).subscribe((response)=>{
      if(response.status === true){
          this.printPackageVariant = response.message;  
          // console.log('package-variant',this.printPackageVariant);

          const storedCartString = localStorage.getItem('cart') || '[]';

          let storedCart;
          try {
            storedCart = JSON.parse(storedCartString);
          } catch (error) {
            // console.error('Error parsing stored cart data:', error);
            storedCart = []; 
          }
    
          if (Array.isArray(storedCart)) {
            this.printPackageVariant.forEach((variant: { ID: any; quantity: any; addButton: boolean; totalAmount: any; }) => {
              const storedItem = storedCart.find((item: any) => item.id === variant.ID);
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
     })
  }

}

interface Service {
  duration: string;
  price: number;
  quantity: number;
  isExpanded: boolean;
}