import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-login-otp',
  templateUrl: './login-otp.page.html',
  styleUrls: ['./login-otp.page.scss'],
})
export class LoginOTPPage implements OnInit {
  
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
  constructor(private router: Router, private apiService : ApiService,private storage: Storage) {
    this.init();
   }

  async init() {
    await this.storage.create();
  }

 async ngOnInit() {
   this.startCountdown();
   const phone = await this.storage.get('PhoneNumber');
    this.apiService.get_signin_details(phone).subscribe(
      async (response: any) => {
        console.log(response);
        if (response.status == true) { 
          
          this.first_login = response.message[0].app_first_login;
          console.log('first_login-',this.first_login)
          const user_index_id = response.message[0].id;
          await this.storage.set('user_index_id', user_index_id);
          if (user_index_id) {
           
          }
        } else {
         
        }
      },
    );
  }

  // Check if all OTP inputs are filled
  checkOtpFilled() {
    this.isOtpFilled = this.otp.every(value => value !== '');  // Ensure every field is filled
  }

  resendOtp() {
    this.clearOtpFields();
    this.getresentOtp();
    clearInterval(this.countdownInterval); // Clear any previous timer
    this.startCountdown(); // Restart the countdown
  }
  async getresentOtp(){
    const phone = await this.storage.get('PhoneNumber');
    if(phone){
      const phone_no = phone;
      const phone_coutry_code = await this.storage.get('selectedcountrycode'); 
      console.log(phone_no, phone_coutry_code)
      this.apiService.getotp(phone_no, phone_coutry_code).subscribe((response)=>{
        if(response){
          // console.log('otp api response', response);
        } else{
          // console.log('otp not run', response);
        }
      })
     }
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

  // Handle OTP submission
  async submitOtp() {
    this.otpCode = this.otp.join('');
    // console.log('OTP is.',this.otpCode);
    const phone_coutry_code = await this.storage.get('selectedcountrycode');
    const phone_no = await this.storage.get('PhoneNumber');
    const otp_code = this.otpCode;
    this.loading_otp = true;
    console.log(phone_coutry_code,phone_no,otp_code)
    this.apiService.getEnteredotpData(phone_no, phone_coutry_code, otp_code).subscribe((response)=>{
      if(response.status == true){
        
        console.log('submitted otp from db', response);
         if (this.isOtpFilled && !this.isTimeOut) {
          if(this.first_login == null || this.first_login == undefined || this.first_login == 0){
            this.router.navigate(['/complete-login']);
          } else{
            this.router.navigate(['/tabs/tab1']);
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
  navigateToLoginPage(){
    this.router.navigate(['/login']);
  }
}
