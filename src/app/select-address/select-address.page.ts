import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonModal, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SafePipe } from '../safe.pipe';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { LoadingServiceService } from '../services/loading-service.service';

import { MapService } from '../map.service';
import { Geolocation } from '@capacitor/geolocation';
import { GeocodingService } from '../geocoding.service';

// import { AdvancedMarkerElement } from '@googlemaps/marker';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.page.html',
  styleUrls: ['./select-address.page.scss'],
  // standalone: true,  
  // imports: [SafePipe] 
})
export class SelectAddressPage implements OnInit {

  map: google.maps.Map | undefined;
  clickableMarker: google.maps.Marker | null = null;

  @ViewChild(IonModal)
  modal!: IonModal;
  @ViewChild('editParagraph', { static: false }) editParagraph!: ElementRef;
  selectedOption: any;
  printAddress: any;
  // isChecked1: boolean = false;
  // isChecked2: boolean = true;
  selectedAddress: string = '';
  flatNumber: string = '';
  buildingName: string = '';
  location: string = '';
  nickname: string = '';
  mapUrl: string | null = null;
  sanitizedMapUrl: SafeResourceUrl | null = null;
  totalAmount: any;
  printServiceLocationData: any;
  district: any;
  state_emirate_name: any;
  selectedDistrict: any;
  selectedStateEmirate: any;
  selectedLocationId: any;
  printEditAddress: any;
  selectedLocation: any;
  updateId: any;
  updateData: any;
  addAddress: string ='Add Address';
  addanotherAddress: string = 'Add Another Address';
  buttonText: string = '';
  showValidationError: boolean = false;
  deleteId: any;
  selectedAddressData: any;
  live_country: any;
  searchTerm: string = '';
  filteredLocations: any[] = []; 
  selectedDiscountCode: any;
  selectedDiscountAmount: any;
  AmountAfterDeductDiscount: any;
  searchInput = '';
  defaultAddress: any;
  value: any;
  address: any;
  isModalOpen: boolean = false;
  isContentVisible: boolean = false;
  IsActiveFoot: boolean = false; // show footer form
  selectedAddressStatus: any;
  booking_type: any;
  selectedAddressId: any;
  
  constructor(
    private modalController: ModalController ,
    private router: Router,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private alertController: AlertController,
    private storage: Storage,
    private http : HttpClient,
    private route: ActivatedRoute,
    private loadingService: LoadingServiceService,
    private geocodingService: GeocodingService,
    private mapService: MapService,
    private cdr: ChangeDetectorRef
  ) {
    this.selectedOption = 'option1';
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  async ngOnInit() {
    this.IsActiveFoot = true;
    // this.loadMap();
    this.booking_type = await this.storage.get('booking_type');
   
    this.selectedDiscountCode = await this.storage.get('selectedDiscountCode');
    this.selectedDiscountAmount = await this.storage.get('selectedDiscountAmount');
    this.AmountAfterDeductDiscount = await this.storage.get('AmountAfterDeductDiscount');
    // this.openLiveLocation();
    this.printServiceLocation();
    this.getAddress();
    const overallTotalAmount = localStorage.getItem('overallTotalAmount');
    this.totalAmount = overallTotalAmount;
  }

  ngAfterViewInit() {
    this.openLiveLocation(); // Now safe to call as the view is initialized
  }
 
  async confirmDelete(deleteParagraph: HTMLElement) {
    const id = deleteParagraph.getAttribute('delete_id');
    const alert = await this.alertController.create({
      header: 'Confirm Delete',  // Correct usage in AlertController, not in Modal
      message: 'Are you sure you want to delete this address?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log('Deletion canceled');
          }
        },
        {
          text: 'OK',
          handler: () => {
            // If user clicks OK, call delete function
            this.OndeleteClick(deleteParagraph);
            
          }
        }
      ]
    });
  
    await alert.present();  // Show the alert
  }

  hide_custom_footer_content() {
    this.IsActiveFoot = true;  // Hide footer
    this.cdr.detectChanges();  // Ensure UI updates
  }
  
  show_custom_footer_content() {
    this.IsActiveFoot = false;  // Show footer
    this.cdr.detectChanges();  // Ensure UI updates
  }
 
  refreshPage() {
    window.location.reload();
  }

  onEditClick(editParagraph: HTMLElement) {
    const id = editParagraph.getAttribute('edit_id');
    if(id){
       this.updateId = id;
       this.deleteId = id;
    }
    this.openModal();
    this.apiService.getEditAddress(id).subscribe((response)=>{
      if(response.status===true){
        const printEditAddress = response.message[0];
        const addressParts = printEditAddress.address.split(',').map((part: string) => part.trim());
        this.check_states_data(printEditAddress.service_location);
        // Assign the parts to flatNumber and buildingName
        this.flatNumber = addressParts.length > 0 ? addressParts[0] : ''; // Get the first part as flatNumber
        this.buildingName = addressParts.length > 1 ? addressParts.slice(1).join(', ') : ''; // Join the rest as buildingName
        this.location = printEditAddress.service_location; // Assuming this corresponds to the selected location
        this.nickname = printEditAddress.title;        
      }
    })
  }

  OndeleteClick(deletePargaph: HTMLElement){
    const id = deletePargaph.getAttribute('delete_id')
    this.apiService.deleteAddresss(id).subscribe((response)=>{
          if(response){
            this.refreshPage();
          }
        })
  }

  openModal() {
    this.modal.present();
  }

  closeModal() {
    this.modalController.dismiss(); 
    this.refreshPage(); // This will close the modal
  }

  printServiceLocation(){
     this.apiService.getServiceLocation().subscribe((response)=>{
      if(response.status===true){
        this.printServiceLocationData = response.message;
        this.district = this.printServiceLocationData.map((location: { district: any; }) => location.district);    
        this.filteredLocations = this.printServiceLocationData;
        this.state_emirate_name = this.printServiceLocationData.map((location: { state_emirate_name: any; }) => location.state_emirate_name); 
      }
     })
  }

  onInput(event: any) {
    const searchTerm = event.detail.value.toLowerCase();
    this.filteredLocations = this.printServiceLocationData.filter((location: { name: any; }) =>
      location.name.toLowerCase().includes(searchTerm)
    );
  }

  onLocationChange1(event: any) {
    this.location = event.detail.value;
  }
 
  async inserAddressInDb(updateId: any){
    // this.generateMapLink();
    if(!updateId){
      const user_id = await this.storage.get('user_index_id');
      const address =  `${this.flatNumber}, ${this.buildingName}, ${this.selectedDistrict}, ${this.selectedStateEmirate}`;
      const LocationUrl = this.address+', '+`${this.flatNumber}, ${this.buildingName}, ${this.selectedDistrict}, ${this.selectedStateEmirate}`;
      // const location_url = this.mapUrl;
      const service_location_id =  this.location;
      const state_emirate  = this.selectedStateEmirate;
      const district  = this.selectedDistrict;
      const title = this.nickname;
      const location_url = this.generateGoogleMapsLink(LocationUrl);
      if (!this.flatNumber || !this.buildingName || !this.location || !this.nickname) {
        this.showValidationError = true;
        return; 
      }  else {
        this.apiService.saveUserAddress(user_id, address, location_url, title, service_location_id, district, state_emirate).subscribe((response)=>{
          if(response){
            this.customClose(); 
          }
        })
      } 
    }
      
     if(updateId){
      const id = updateId;
      const address =  `${this.flatNumber}, ${this.buildingName}`;
      const LocationUrl = this.address+', '+`${this.flatNumber}, ${this.buildingName}, ${this.selectedDistrict}, ${this.selectedStateEmirate}`;
      // const location_url = this.mapUrl;
      const service_location_id =  this.location;
      const state_emirate  = this.selectedStateEmirate;
      const district  = this.selectedDistrict;
      const title = this.nickname;
      const location_url = this.generateGoogleMapsLink(LocationUrl);
      // console.log(LocationUrl);
      this.apiService.UpdateAddress(id, address, location_url, title, service_location_id, district, state_emirate).subscribe((response)=>{
        if(response.status === true){
              this.updateData = response.message;
              this.customClose();
              // this.refreshPage();
        }
      })
     }
  }

  generateGoogleMapsLink(address: string): string {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  }

  onLocationChange(event: any) {
    const selectedId = event.detail.value; 
    const selectedLocation = this.printServiceLocationData.find((location: { id: any; }) => location.id === selectedId);

    if (selectedLocation) {
      this.selectedDistrict = selectedLocation.district;
      this.selectedStateEmirate = selectedLocation.state_emirate_name;
    }
  }
  
  check_states_data(selectedId: any){
    const selectedLocation = this.printServiceLocationData.find((location: { id: any; }) => location.id === selectedId);
    if (selectedLocation) {
      this.selectedDistrict = selectedLocation.district;
      this.selectedStateEmirate = selectedLocation.state_emirate_name;
    }
  }

  async onSelectAddress(event: any, addressData: any) {
 
    const selectedValue = event.detail.value;
    
    if (event.detail.value !== addressData.id) {
      this.selectedAddressStatus = 1; // Set status to 1 when selected
    } else {
      this.selectedAddressStatus = 0; // Reset to 0 when unselected
    }

    this.value = event.detail.value === this.selectedAddress;
 

    this.selectedAddressData = this.printAddress.find((address: { title: any; }) => address.title === selectedValue);
    
    if (this.selectedAddressData) {
      const serviceLocation = this.selectedAddressData.service_location;
      const locationUrl = this.selectedAddressData.location_url;
      await this.storage.set('selectedLocationUrl', locationUrl);
      await this.storage.set('selectedAddressTitle', selectedValue);
      await this.storage.set('ServiceLocation', serviceLocation);
      await this.storage.set('selectedAddress', addressData.address);
      await this.storage.set('selectedaddressOption', this.selectedOption);
    }
  }

  generateMapLink() {
    let address = `${this.flatNumber}, ${this.buildingName}, ${this.location}, ${this.live_country}`;
    const flatNumber= this.flatNumber;
    const buildingNumber = this.buildingName;
    const location = this.location;
    const Nickname = this.nickname;
    const live_country =  this.live_country;
    const fullAdress= `${flatNumber}, ${buildingNumber}, ${location}, ${live_country }`
    let encodedAddress = encodeURIComponent(address);
    
    // Generate the Google Maps link
    this.mapUrl = `https://www.google.com/maps?q=${encodedAddress}+&output=embed`;
    
    // Sanitize the URL to make it safe for the iframe
    this.sanitizedMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.mapUrl);   
  }

  openLiveLocation() {
    this.mapService.getCurrentPosition().then(position => {
      const lat = position.latitude;
      const lon = position.longitude;

      // Load the map with current location
      this.loadMap(lat, lon);

      // Get address for the current location
      this.getAddressFromCoordinates(lat, lon);
    }).catch(error => {
      console.error('Error retrieving location:', error);
      alert('Unable to retrieve your location.');
    });
  }

  async loadMap(lat: number, lon: number) {
    const coordinates = await Geolocation.getCurrentPosition();
    const location = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude,
    };

    this.map = new google.maps.Map(document.getElementById('map_canvas') as HTMLElement, {
      center: location,
      zoom: 15,
    });

    // Add a marker for the user's current location
    new google.maps.Marker({
      position: location,
      map: this.map,
      title: 'You are here!',
    });

    // Handle map click to add a clickable marker
    this.map.addListener('click', (event) => {
      this.show_custom_footer_content();
      this.handleMapClick(event.latLng);
    });

  }

  handleMapClick(latLng: google.maps.LatLng) {
    this.show_custom_footer_content();
    this.mapService.reverseGeocode(latLng.lat(), latLng.lng()).then((data: any) => {
      if (data.results && data.results.length) {  
        this.address = data.results[0].formatted_address;
        this.show_custom_footer_content();

      }
    }).catch(error => {
      console.error('Error during geocoding:', error);
    });

    // If a marker already exists, move it; otherwise, create a new one
    if (this.clickableMarker) {
      this.clickableMarker.setPosition(latLng);
      this.show_custom_footer_content();
    } else {
      this.show_custom_footer_content();
      this.clickableMarker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        title: 'Selected location',
        icon: {
          url: 'https://dashboard.getglowsalon.ae/staging/template/map-pin.png', // Use your desired icon
        },
      });
    }
    this.cdr.detectChanges();
  }

  getAddressFromCoordinates(lat: number, lon: number) {
    this.mapService.reverseGeocode(lat, lon).then((data: any) => {
      if (data.results && data.results.length) {
        this.address = data.results[0].formatted_address; // Adjust according to your geocoding API response
        // this.isModalOpen = true;
      }
    }).catch((error) => {
      console.error('Error during geocoding:', error);
      alert('Unable to retrieve address.');
    });
  }

  
 async getAddress(){
  this.loadingService.presentLoading(); 
    const user_id = await this.storage.get('user_index_id');
    this.apiService.getSelectAddress(user_id).subscribe(async (response)=>{
      if (response) {
        if (Array.isArray(response.message)) {
          this.printAddress = response.message;
          this.buttonText = this.addanotherAddress;
          this.defaultAddress = this.printAddress.find((address: { default_address: any; }) => address.default_address === '1');
          const default_service_location = this.defaultAddress?.service_location;
          // console.log('default_service_location',default_service_location)
          if (this.defaultAddress) {
            this.selectedAddress = this.defaultAddress.title;
            await this.storage.set('ServiceLocation', default_service_location);
           // Set to title of default address
          } else {
            console.warn('No default address found');
            this.selectedAddress = ''; // Clear if none found
          }
        } else {
          this.buttonText = this.addAddress;
          console.error('Expected an array but got:', response.message);
          this.printAddress = []; // Set to empty array if not an array
        }
        // console.log('address array', this.printAddress);
      }
      setTimeout(() => {
        this.loadingService.dismissLoading();
      }, 3000);
    });
  }

  customClose() {
    this.modalController.dismiss();
    this.sanitizedMapUrl = '';
    this.flatNumber = '';
    this.buildingName = '';
    this.location = '';
    this.nickname = '';
    this.refreshPage();
  }

  navigateToSelectAddress(){

    if(this.selectedAddressData || this.defaultAddress){
      this.router.navigate(['/select-date-time']);  
    } else{
      //  console.log('please choose address')
    } 
    const value = this.selectedAddressStatus;
    const index_id = this.selectedAddressData.id; // get id to update last Selected addresss by user
    console.log('index_id', index_id)
    this.apiService.updateLastselectedAddress(index_id, value).subscribe((response)=>{
      if(response.status === true){
            this.updateData = response.message;
            // console.log('updated or not', this.updateData);
      }
    })
    
  
  }

  navigateToviewBooking(){
    const last_cat = localStorage.getItem('select_address_cat');
    this.router.navigate(['/view-booking']);
  }

}