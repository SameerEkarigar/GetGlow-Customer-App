import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  pleaseEnterPhone: any;
  first_name: any;
  last_name: any;
  email: any;
  id: any;
  isFieldsDisabled: boolean = true;
  isChecked2: boolean = true;
  showSignInButton: boolean= false;
  errorMessage: string = '';
  isPhoneNumberValid: boolean = false;


  CountryCode: any[] = []; // Original country code list
  filteredCountryCode: any[] = []; // Filtered country code list for search functionality
  // selectedPrefix: string = ''; // Selected country prefix
  searchText: string = ''; // Search text from the input field

  constructor(private http: HttpClient, private router: Router, private apiservice: ApiService, private storage: Storage) { 
    this.init();
    this.filteredItems = this.items; 
  }
  // CountryCode: any;
  myData: any[] = [];
  selectedCode: any;
  selectedPrefix: string = '+971';
  phoneNumber: any;
  selectedcountrycode: any;
  // CountryCode: any[] = []; // All country codes
  // filteredCountryCode: any[] = []; 

  items: string[] = ['Apple', 'Banana', 'Cherry', 'Date', 'Grape', 'Mango', 'Orange'];
  filteredItems: string[] = [];
  searchQuery: string = '';
  showDropdown: boolean = false;
  dropdownOpen: boolean = false;

  prefixes: { telephonePrefix: string }[] = []; // Array of objects containing telephonePrefix
  filteredPrefixes: { telephonePrefix: string }[] = []; // Filtered list for display
  // selectedPrefix: string = ''; // User's selected prefix
  

async ngOnInit() {
  await this.storage.set('selectedcountrycode', this.selectedPrefix); 
  this.getCountryCode();
}
async init() {
  await this.storage.create();
}

//   async onPrefixChange(event: any) {
//   this.selectedPrefix = event.detail.value;
//   console.log(this.selectedPrefix)
//   await this.storage.set('selectedcountrycode', this.selectedPrefix);  // Use this value as needed
// }

async navigateToCompleteLoginPage() {
 const phone = await this.storage.set('PhoneNumber', this.phoneNumber);
 console.log(phone)
 this.apiservice.get_signin_details(phone).subscribe(
  async (response: any) => {
    if (response.status == true) {
      const phone_country_code = this.selectedPrefix;
      const phone = this.phoneNumber;    
      this.first_name = response.message[0].first_name;
      this.last_name = response.message[0].last_name;
      this.email = response.message[0].email;
      this.id = response.message[0].id;
      
      this.isFieldsDisabled = true;
      const marketing_checkbox = this.isChecked2;
      const user_index_id = this.id;
     
      await this.storage.set('user_index_id', user_index_id);
      await this.storage.set('phone_country_code', phone_country_code);
      await this.storage.set('phone', phone);
      await this.storage.set('first_name', this.first_name);
      await this.storage.set('last_name', this.last_name);
      await this.storage.set('email', this.email);
      await this.storage.set('checkboxResponse', marketing_checkbox);

      if (user_index_id) {
       this.showSignInButton = true;
      }
    } else {
      this.isFieldsDisabled = false;
      this.showSignInButton = false;
      this.first_name = '';
      this.last_name = '';
      this.email = '';
    }
  },
);
 if(phone){
  const phone_no = phone;
  const phone_coutry_code = this.selectedPrefix; 
  console.log(phone_no, phone_coutry_code)
  this.apiservice.getotp(phone_no, phone_coutry_code).subscribe((response)=>{
    if(response){
      // console.log('otp api response', response);
    } else{
      // console.log('otp not run', response);
    }
  })
  if(this.isPhoneNumberValid == true){
    this.router.navigate(['/login-otp']);
  }
 }
 else{
   this.pleaseEnterPhone = 'Please Enter Your Mobile Number'
 }
}

onPhoneNumberChange(event: any){
  const value = event.target.value;
 // Check if the first character is '0'
 if (value.startsWith('0') && value.length > 1) {
  // Remove the leading '0'
  this.phoneNumber = value.substring(1);
}
if (this.phoneNumber.length >= 9) {
  this.isPhoneNumberValid = true;
  this.errorMessage = '';
} else {
  this.isPhoneNumberValid = false;
  this.errorMessage = 'Phone number must be at least 9 digits.';
}
}


getCountryCode() {
  this.apiservice.get_country_code().subscribe((response: any) => {
    if (response) {
      this.CountryCode = response;
      this.filteredCountryCode = [...this.CountryCode]; // Initialize filtered list

      // Ensure selectedPrefix is valid
      if (
        !this.CountryCode.find(
          (prefix: { telephonePrefix: string }) => prefix.telephonePrefix === this.selectedPrefix
        )
      ) {
        this.selectedPrefix = ''; // Reset if default is not in the list
      }
    }
  });
}

filterPrefix(event: any) {
  const searchTerm = event.target.value.toLowerCase();
  this.filteredCountryCode = this.CountryCode.filter((data) =>
    data.telephonePrefix.includes(searchTerm)
  );
}

// Handle prefix selection
// onPrefixChange(selected: string) {
//   this.selectedPrefix = selected;
//   console.log('Selected Prefix:', selected);
// }
  async selectPrefix(selected: string) {
  this.selectedPrefix = selected;
  this.dropdownOpen = false;
  await this.storage.set('selectedcountrycode', this.selectedPrefix); // Close dropdown after selection
}

toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}
filterPrefixes(event: Event) {
  const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
  this.filteredPrefixes = this.prefixes.filter((prefix) =>
    prefix.telephonePrefix.toLowerCase().includes(searchTerm)
  );
}

}