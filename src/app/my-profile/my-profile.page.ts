import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {
  @ViewChild('otpModal', { static: true }) otpModal!: IonModal;
  isOtpFilled: boolean = false;
  isTimeOut: boolean = false;
  otp: string[] = ['', '', '', ''];  // 4-digit OTP input array
  otpDigits = new Array(4);  // Create a loop for 4 input boxes
  totalTime: number = 10; // 2 minutes = 120 seconds
  minutes: number = 0;
  seconds: number = 0;
  countdownInterval: any;
  first_login: any;
  otpCode: any;
  errorMessage: any;
  loading_otp: boolean = false;
  loading: boolean = false;



  CountryCode: any[]=[];
  // selectedPrefix: any;
  myData: any[] = [];
  selectedCode: any;
  selectedPrefix: string = '+971';
  phoneNumber: any;
  selectedcountrycode: any;
  // CountryCode: any[] = []; // All country codes
  // filteredCountryCode: any[] = []; 
  pleaseEnterPhone: any;
  errorMessage2: any;

  id: any;
  isFieldsDisabled: boolean = true;
  isChecked2: boolean = true;
  showSignInButton: boolean= false;
  
  isPhoneNumberValid: boolean = false;

  items: string[] = ['Apple', 'Banana', 'Cherry', 'Date', 'Grape', 'Mango', 'Orange'];
  filteredItems: string[] = [];
  searchQuery: string = '';
  showDropdown: boolean = false;
  dropdownOpen: boolean = false;
  isModalOpen = false;

  prefixes: { telephonePrefix: string }[] = []; // Array of objects containing telephonePrefix
  filteredPrefixes: { telephonePrefix: string }[] = []; // Filtered list for display
  // selectedPrefix: string = ''; // User's selected prefix
  filteredCountryCode: any[] = []; // Filtered country code list for search functionality
  // selectedPrefix: string = ''; // Selected country prefix
  searchText: string = ''; // Search text from the input field
  constructor(private apiservice: ApiService ,private storage: Storage, private modalController: ModalController, private router: Router, private apiService: ApiService) {
    this.init();
   }
  phone_country_code: any;
  phone: any;
  first_name: any;
  last_name: any;
  email: any;
  marketing_checkbox: boolean = false;
  user_index_id: any;


  async  ngOnInit(){
    // this.getNewUserData();
      this.getCountryCode();
      this.loadData();
      this.getUserDetailToUpdate();
     
    }

  async init() {
    await this.storage.create();
  }
    customClose() {
    this.modalController.dismiss();
    // location.reload();
  }
  
  navigateToTab3(){
    this.router.navigate(['/tabs/tab3']);
  }
  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      // Any calls to load data go here
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }
 
  async loadData(){
    this.phone_country_code = await this.storage.get('phone_country_code');  
      this.phone = await this.storage.get('PhoneNumber');  
      this.first_name = await this.storage.get('first_name');  
      this.last_name = await this.storage.get('last_name');  
      this.email = await this.storage.get('email');  
      this.marketing_checkbox = await this.storage.get('checkboxResponse');  
      this.user_index_id = await this.storage.get('user_index_id'); 
      console.log(this.user_index_id);
  }
  refreshPage(event: any) {
    console.log("Refreshing data...");
    this.getUserDetailToUpdate();
    setTimeout(() => {
      console.log("Refresh completed");
      event.target.complete(); // Stop the refresh spinner
    }, 2000);
  }


//  async getNewUserData(){
//     // const phone = this.phone;
//     const phone =  await this.storage.get('Newphone'); 
//     this.apiService.get_signin_details(phone).subscribe((response)=>{
//       if(response){
//           this.user_index_id = response.message[0].id;
//       }
//     })
//   }

  async getUserDetailToUpdate(){
    const phone_country_code = this.phone_country_code;  
    const phone = this.phone;  
    const first_name = this.first_name;  
    const last_name = this.last_name;  
    const email = this.email;  
    // const marketing_checkbox = await this.storage.get('checkboxResponse');  
    const user_index_id = this.user_index_id; 
      
    // })
    console.log(phone_country_code,phone,first_name,last_name,email,user_index_id);
    this.apiService.updateUserDetailOnProfilePage(user_index_id, phone_country_code, phone, first_name, last_name, email,).subscribe(async (response)=>{
      if(response.status == true){
        await this.storage.set('phone_country_code',phone_country_code);  
        await this.storage.set('PhoneNumber',phone);  
        await this.storage.set('first_name',first_name);  
        await this.storage.set('last_name',last_name);  
        await this.storage.set('email',email);  
        location.reload();
        console.log(response);

        }
    })
  }
  onChangeCountryCode(event: any){
    this.phone_country_code = event.detail.value;
  }
  onPhoneChange(event: any){
    this.phone= event.detail.value;
  }
  onLastNameChange(event: any) {
    this.last_name = event.detail.value;  // Store the new value in the variable
  }
  onFirstNameChange(event: any) {
    this.first_name = event.detail.value;  // Store the new value in the variable
  }
  onEmailChange(event: any) {
    this.email = event.detail.value;  // Store the new value in the variable
   }

  onPhoneNumberChangeevent(event: any){
    const value = event.target.value;
   // Check if the first character is '0'
   if (value.startsWith('0') && value.length > 1) {
    // Remove the leading '0'
    this.phoneNumber = value.substring(1);
  }
  if (this.phoneNumber.length >= 9) {
    this.isPhoneNumberValid = true;
    this.errorMessage2 = '';

  } else {
    console.log('false')
    this.isPhoneNumberValid = false;
    this.errorMessage2 = 'Phone number must be at least 9 digits.';
  }
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  filterPrefix(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredCountryCode = this.CountryCode.filter((data) =>
      data.telephonePrefix.includes(searchTerm)
    );
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
  async selectPrefix(selected: string) {
    this.selectedPrefix = selected;
    this.dropdownOpen = false;
    await this.storage.set('selectedcountrycode', this.selectedPrefix); // Close dropdown after selection
  }

  async getOTPFucntion() {
    const phone = this.phoneNumber;
    console.log(phone)
    this.clearOtpFields();
    if(this.isPhoneNumberValid == true){
     const phone_no = phone;
     const phone_coutry_code = this.selectedPrefix; 
     console.log(phone_no, phone_coutry_code);
     this.setOpen(true);
     this.apiservice.getotp(phone_no, phone_coutry_code).subscribe((response)=>{
       if(response){
         console.log('otp api response', response);
        //  this.customClose();
         
         this.startCountdown();
       } else{
         console.log('otp not run', response);
       }
     })
    }
    else{
      this.pleaseEnterPhone = 'Please Enter Your Mobile Number'
    }
   }

   checkOtpFilled() {
    this.isOtpFilled = this.otp.every(value => value !== '');  // Ensure every field is filled
  }

  setOpen(isOpen: true) {
    this.isModalOpen = isOpen;
  }

  resendOtp() {
    this.clearOtpFields();
    this.getOTPFucntion();
    clearInterval(this.countdownInterval); // Clear any previous timer
    this.startCountdown(); // Restart the countdown
  }

  // Countdown Timer Logic
  startCountdown() {
    this.isTimeOut = false; // Reset the timeout flag
    this.totalTime = 120;   // Reset to 2 minutes

    // Start the countdown
    this.countdownInterval = setInterval(() => {
      if (this.totalTime > 0) {
        this.totalTime--;
        this.updateTimeDisplay();
      } else {
        this.isTimeOut = true; // Timer has reached 0
        clearInterval(this.countdownInterval); // Stop the countdown
      }
    }, 1000); // Update every second
  }

  // Clear OTP fields
  clearOtpFields() {
    this.otp = ['', '', '', ''];
    this.isOtpFilled = false; // Reset filled status
  }

  // Update minutes and seconds display
  updateTimeDisplay() {
    this.minutes = Math.floor(this.totalTime / 60);
    this.seconds = this.totalTime % 60;
  }

  // Cleanup countdown when leaving the page
  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval); // Stop the timer if the user leaves the page
    }
  }
  navigateTotabstab3(){
    this.router.navigate(['/tabs/tab3']);
  }
  // Handle OTP submission
  async submitOtp() {
    this.otpCode = this.otp.join('');
    // console.log('OTP is.',this.otpCode);
    const phone_coutry_code = this.selectedPrefix;
    const phone_no = this.phoneNumber;
    const otp_code = this.otpCode;
    this.loading_otp = true;
    console.log(phone_coutry_code,phone_no,otp_code)
    this.apiService.getEnteredotpData(phone_no, phone_coutry_code, otp_code).subscribe(async (response)=>{
      if(response.status == true){
        this.customClose();
        this.phone = await this.storage.set('PhoneNumber',this.phoneNumber);
        console.log('submitted otp from db', response);
         if (this.isOtpFilled && !this.isTimeOut) {
          if(this.first_login == null || this.first_login == undefined || this.first_login == 0){
            this.phone = await this.storage.set('PhoneNumber',this.phoneNumber);
            this.customClose();

          } else{
            this.customClose();
          }
            // console.log('OTP submitted:', this.isOtpFilled );
        }
        
        else if (!this.isOtpFilled || this.isTimeOut) {
            console.log('OTP is not completely filled or timeout has occurred.');
        }
        this.loading_otp = false;
      } else{
        console.log('error message should be arribved')
           this.errorMessage = 'Incorrect OTP';
           setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        
           this.loading_otp = false;
      }
    })
    // Check if OTP is filled, not timed out, and first_login is empty
  
}

  
  onInputChange(index: number, event: any) {
    const input = event.target as HTMLInputElement;
    
    // If input length exceeds 1, take only the first digit
    if (input.value.length > 1) {
      this.otp[index] = input.value.charAt(0); // Set to the first digit
      input.value = this.otp[index]; // Update the input value
    } else {
      this.otp[index] = input.value; // Set the value normally
    }
  
    // Move to the next input if a digit is entered
    if (this.otp[index].length === 1 && index < this.otp.length - 1) {
      const nextInput = document.querySelector(
        `input[name='otp-${index + 1}']`
      ) as HTMLInputElement;
      nextInput?.focus();
    }
  
    // Check if all OTP fields are filled after each input
    this.checkOtpFilled();
  }

  // Handle Backspace keypress to move to the previous input
  handleKeyDown(index: number, event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    // If Backspace is pressed and the input is empty, move to the previous input
    if (event.key === 'Backspace' && input.value === '' && index > 0) {
      const prevInput = document.querySelector(
        `input[name='otp-${index - 1}']`
      ) as HTMLInputElement;
      prevInput?.focus();
      prevInput.value = ''; // Clear the previous input value
    }
  }
  
}
