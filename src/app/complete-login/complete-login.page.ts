import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-complete-login',
  templateUrl: './complete-login.page.html',
  styleUrls: ['./complete-login.page.scss'],
})
export class CompleteLoginPage implements OnInit {
  signInData: any;
  form: FormGroup;
  phoneNumber: any;
  first_name: any;
  last_name: any;
  email: any;
  isChecked1: boolean = true;
  isChecked2: boolean = true;
  apiPhone: any;
  selectedPrefix: string = '+971';
  CountryCode: any;
  isBlank: any;
  isFieldsDisabled: boolean = false;
  showSignInButton: boolean= false;
  emailSyntax: boolean= false;
  message: boolean = false;
  checkboxerror: boolean = false;
  selectedCountryCode: any;
  id: any;
  constructor(
    private router: Router,
    private api: ApiService,
    private fb: FormBuilder,
    private apiservice: ApiService,
    private alertController: AlertController,
    private storage : Storage
  ) {
    this.init();
    this.form = this.fb.group({
      termsAndConditions: [false, Validators.requiredTrue],
      email: ['', [Validators.required, Validators.email]],
      promotionalMessages: [false]
    });
  }

  async ngOnInit() {
      this.selectedCountryCode = await this.storage.get('selectedcountrycode');
      console.log(this.selectedCountryCode)
      this.getCountryCode();    
      const phonenumber = await this.storage.get('PhoneNumber');
      this.phoneNumber = phonenumber;
      const phone = this.phoneNumber;
  
      if (!phone || phone.trim() === '') {
        // Clear fields if phone number is empty
        this.first_name = '';
        this.last_name = '';
        this.email = '';
        return;
      }
    
      this.api.get_signin_details(phone).subscribe(
        async (response: any) => {
          if (response.status == true) {
            const phone_country_code = this.selectedCountryCode;
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
    }

  async init() {
    await this.storage.create();
  }

 async checkresponse(){
  await this.storage.set('checkboxResponse', this.isChecked2);   
  const marketing_checkbox = this.isChecked2;
  const phone_country_code = this.selectedCountryCode;
  const phone = this.phoneNumber;
  const first_name = this.first_name;
  const last_name= this.last_name;
  const email = this.email;
  const first_login = '1';
  const user_index_id =  await this.storage.get('user_index_id');
     this.apiservice.updateUserDetail(user_index_id, phone_country_code, phone,first_name,last_name,email,marketing_checkbox,first_login).subscribe(async (response)=>{
      if(response.status == true){
        console.log(response);
        await this.storage.set('phone_country_code', phone_country_code);
        const setphone = await this.storage.set('Newphone', phone);
        await this.storage.set('first_name', first_name);
        await this.storage.set('last_name', last_name);
        await this.storage.set('email', email);
        await this.storage.set('checkboxResponse', marketing_checkbox);
      }
     })
  }
  onCountryCodeChange(event: any) {
    // Log the selected value
  }
 async newUserDataSubmit(){
   const marketing_checkbox = this.isChecked2;
   const phone_country_code = this.selectedCountryCode;
   const phone = this.phoneNumber;
   const first_name = this.first_name;
   const last_name= this.last_name;
   const email = this.email;

  this.apiservice.saveUerLoginData(phone_country_code, phone, first_name, last_name, email, marketing_checkbox).subscribe(async (response)=>{
    if(response.status == true){
        await this.storage.set('phone_country_code', phone_country_code);
        const setphone = await this.storage.set('Newphone', phone);
        await this.storage.set('first_name', first_name);
        await this.storage.set('last_name', last_name);
        await this.storage.set('email', email);
        await this.storage.set('checkboxResponse', marketing_checkbox);
        await this.storage.set('user_index_id', response.user_id);
      }
    });
  }

  navigateTologinPage() {
    this.router.navigate(['/login']);
  }
 
  get_user_details() {
    const firstName = this.first_name ? this.first_name.trim() : '';
    const lastName = this.last_name ? this.last_name.trim() : '';
    const email = this.email ? this.email.trim() : '';
    const phoneNumber = this.phoneNumber ? this.phoneNumber.trim() : '';
  
    // Email validation: check for "@" and "."
    const isValidEmail = email.includes('@') && email.includes('.');
  
    // Check if all required fields are filled
    if (!firstName || !lastName || !email || !phoneNumber) {
      this.message = true;
      return;
    }
  
    // If email is not valid, display error and prevent form submission
    if (!isValidEmail) {
      this.emailSyntax= true;
      this.message = false;
      // alert('Please enter a valid email address containing "@" and "."');
      return;
    }
  
    // If all fields are valid, proceed with form submission
    this.submitForm();
    this.message = false;
  }
  
  onInputChange(event: any) {
    this.phoneNumber = event.target.value;
    if (this.phoneNumber === '') {
      this.first_name = '';
      this.last_name = '';
      this.email = '';
    }
  }

// async chcekExistingUSer() {
//   console.log(this.phoneNumber)
 
// }
  submitForm() {
    if (this.isChecked1 == true) {
      this.router.navigate(['/tabs/tab1']);
    }
    else if(this.isChecked1 == false){
      this.checkboxerror = true;
    }
  }

  getCountryCode() {
    this.apiservice.get_country_code().subscribe((response: any) => {
      if (response) {
        this.CountryCode = response;
        if (!this.CountryCode.find((prefix: { telephonePrefix: string }) => prefix.telephonePrefix === this.selectedPrefix)) {
          this.selectedPrefix = '';  // Reset if default is not in the list
        }
      }
    })
  }
}


