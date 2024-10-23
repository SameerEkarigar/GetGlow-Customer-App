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

  constructor(private http: HttpClient, private router: Router, private apiservice: ApiService, private storage: Storage) { 
    this.init();
  }
  CountryCode: any;
  myData: any[] = [];
  selectedCode: any;
  selectedPrefix: string = '+971';
  phoneNumber: any;
  

async ngOnInit() {
this.getCountryCode();

}
async init() {
  await this.storage.create();
}

async navigateToCompleteLoginPage() {
 const phone = await this.storage.set('PhoneNumber', this.phoneNumber);
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
  this.router.navigate(['/login-otp']);
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
}

getCountryCode(){
  this.apiservice.get_country_code().subscribe((response: any)=>{
      if(response){
        this.CountryCode = response;
        if (!this.CountryCode.find((prefix: { telephonePrefix: string }) =>  prefix.telephonePrefix === this.selectedPrefix)) {
          this.selectedPrefix = '';  // Reset if default is not in the list
        }
      }
  })
}
}