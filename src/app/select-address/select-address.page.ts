import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonModal, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SafePipe } from '../safe.pipe';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { LoadingServiceService } from '../services/loading-service.service';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.page.html',
  styleUrls: ['./select-address.page.scss'],
  // standalone: true,  
  // imports: [SafePipe] 
})
export class SelectAddressPage implements OnInit {
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

 // Selected location
 
  constructor(private modalController: ModalController ,
    private router: Router,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private alertController: AlertController,
    private storage: Storage,
    private http : HttpClient,
    private route: ActivatedRoute,
    private loadingService: LoadingServiceService
) { 
       this.selectedOption = 'option1';
       this.init();
    }

    async init() {
      await this.storage.create();
    }
    ngAfterViewInit() {
      
    }
 async ngOnInit() {

    this.selectedDiscountCode = await this.storage.get('selectedDiscountCode');
    this.selectedDiscountAmount = await this.storage.get('selectedDiscountAmount');
    this.AmountAfterDeductDiscount = await this.storage.get('AmountAfterDeductDiscount');
    this.openLiveLocation();
    this.printServiceLocation();
    this.getAddress();
    const overallTotalAmount = localStorage.getItem('overallTotalAmount');
    this.totalAmount = overallTotalAmount;
    
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
            console.log('Deletion canceled');
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
      const location_url = this.mapUrl;
      const service_location_id =  this.location;
      const state_emirate  = this.selectedStateEmirate;
      const district  = this.selectedDistrict;
      const title = this.nickname;
      if (!this.flatNumber || !this.buildingName || !this.location || !this.nickname) {
        this.showValidationError = true;
        return; 
      }  else{
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
      const location_url = this.mapUrl;
      const service_location_id =  this.location;
      const state_emirate  = this.selectedStateEmirate;
      const district  = this.selectedDistrict;
      const title = this.nickname;
      this.apiService.UpdateAddress(id, address, location_url, title, service_location_id, district, state_emirate).subscribe((response)=>{
        if(response.status === true){
              this.updateData = response.message;
              this.customClose();
              // this.refreshPage();
        }
      })
     }
  }

  onLocationChange(event: any) {
    const selectedId = event.detail.value; 
    const selectedLocation = this.printServiceLocationData.find((location: { id: any; }) => location.id === selectedId);

    if (selectedLocation) {
      this.selectedDistrict = selectedLocation.district;
      this.selectedStateEmirate = selectedLocation.state_emirate_name;
    }
  }
  
async onSelectAddress(event: any, addressData: any) {
 
    const selectedValue = event.detail.value;
    this.value = event.detail.value === this.selectedAddress;
    console.log(this.value);

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Get user's current latitude and longitude
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Generate a Google Maps link with the user's current location
          const liveLocationUrl = `https://www.google.com/maps?q=${lat},${lon}&output=embed`;
          // console.log('live Location : ',liveLocationUrl);
          // Update the iframe's source with live location URL
          this.sanitizedMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(liveLocationUrl);
          // console.log('Live Location Map URL:', this.sanitizedMapUrl);
          this.getAddressFromCoordinates(lat, lon);
        },
        (error) => {
          console.error('Error retrieving location:', error);
          alert('Unable to retrieve your location.');
        }
      );
    }
  }
    // Function to get the address using Nominatim
  getAddressFromCoordinates(lat: number, lon: number) {
      const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  
      // Make an HTTP request to Nominatim
      this.http.get(geocodeUrl).subscribe((response: any) => {
        if (response && response.address) {
          const addressComponents = response.address;
          const suburb = addressComponents.suburb;
          const live_city = addressComponents.county;
          this.live_country = addressComponents.country;
          const live_postcode = addressComponents.postcode;
          const live_state = addressComponents.state;
          const live_neighbourhood = addressComponents.neighbourhood;

          // console.log('Live addres--', suburb,',',live_city,',',live_state,',',live_country,',',live_postcode);
          // Extract relevant parts of the address
          // this.flatNumber = live_neighbourhood;
          // this.buildingName = live_neighbourhood;
          // this.location = live_city + live_state + live_country;
  
        } else {
          console.error('Unable to get address from coordinates');
          alert('Unable to retrieve address.');
        }
      });
    }

 async getAddress(){
  this.loadingService.presentLoading(); 
    const user_id = await this.storage.get('user_index_id');
    this.apiService.getSelectAddress(user_id).subscribe((response)=>{
      // console.log(response);

      if (response) {
        if (Array.isArray(response.message)) {
          this.printAddress = response.message;
          this.buttonText = this.addanotherAddress;
          this.defaultAddress = this.printAddress.find((address: { default_address: any; }) => address.default_address === '1');
          if (this.defaultAddress) {
            this.selectedAddress = this.defaultAddress.title; // Set to title of default address
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
      this.loadingService.dismissLoading();
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
    const value = this.value;
    const index_id = this.selectedAddressData.id; // get id to update last Selected addresss by user
    console.log('Your Attribute Value:', index_id);
    this.apiService.updateLastselectedAddress(index_id, value).subscribe((response)=>{
      if(response.status === true){
            this.updateData = response.message;
            console.log('updated or not', this.updateData)
            // this.customClose();
            // this.refreshPage();
      }
    })

    if(this.selectedAddressData || this.defaultAddress){
      this.router.navigate(['/select-date-time']);  
    } else{
       console.log('please choose address')
    }
    
  }

  navigateToviewBooking(){
    const last_cat = localStorage.getItem('select_address_cat');
    this.router.navigate(['/view-booking']);
  }

}