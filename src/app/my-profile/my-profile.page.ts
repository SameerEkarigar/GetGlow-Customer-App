import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {
  CountryCode: any[]=[];
  selectedPrefix: any;

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
    this.getNewUserData();
      this.getCountryCode();
      // this.getUserDetailToUpdate();
      this.phone_country_code = await this.storage.get('phone_country_code');  
      this.phone = await this.storage.get('PhoneNumber');  
      this.first_name = await this.storage.get('first_name');  
      this.last_name = await this.storage.get('last_name');  
      this.email = await this.storage.get('email');  
      this.marketing_checkbox = await this.storage.get('checkboxResponse');  
      this.user_index_id = await this.storage.get('user_index_id'); 
    }

  async init() {
    await this.storage.create();
  }
    customClose() {
    this.modalController.dismiss();
  }

  navigateToTab3(){
    this.router.navigate(['/tabs/tab3']);
  }

 async getNewUserData(){
    // const phone = this.phone;
    const phone =  await this.storage.get('Newphone'); 
    this.apiService.get_signin_details(phone).subscribe((response)=>{
      if(response){
          this.user_index_id = response.message[0].id;
      }
    })
  }

  async getUserDetailToUpdate(){
    const phone_country_code = this.phone_country_code;  
    const phone = this.phone;  
    const first_name = this.first_name;  
    const last_name = this.last_name;  
    const email = this.email;  
    const marketing_checkbox = await this.storage.get('checkboxResponse');  
    const user_index_id = this.user_index_id; 
      
    // })
    this.apiService.updateUserDetail(user_index_id, phone_country_code, phone, first_name, last_name, email, marketing_checkbox).subscribe((response)=>{
      if(response){
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
  onPhoneNumberChange(event: any){
    const value = event.target.value;
     // Check if the first character is '0'
     if (value.startsWith('0') && value.length > 1) {
      // Remove the leading '0'
      this.phone = value.substring(1);
    }
  }
}
