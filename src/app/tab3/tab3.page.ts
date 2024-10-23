import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page {

  checkboxResponse: any;
  first_name: any;
  last_name: any;
  marketingCheckbox: any;
  user_index_id: any;

  constructor(private router: Router, private storage: Storage, private apiService: ApiService) {
    this.init();
  }

  async ngOnInit(){
    this.user_index_id= await this.storage.get('user_index_id')
    this.first_name = await this.storage.get('first_name');
    this.last_name =  await this.storage.get('last_name');
    this.checkboxResponse = await this.storage.get('checkboxResponse');
  }

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        // console.log('Log Out canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        // console.log('Log Out confirmed');
        this.logOut();
      },
    },
  ];

  public deleteButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        // console.log('delte canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        // console.log('delete confirmed');
      },
    },
  ];

  async init() {
    await this.storage.create();
  }

  onCheckboxChange() {
    const marketing_checkbox = this.checkboxResponse;
    const user_index_id = this.user_index_id;
    this.apiService.updateMarketingCheck(user_index_id,marketing_checkbox).subscribe((response)=>{
      if(response){
         console.log('chcekbox updated');
      }
    })
  }

 async logOut(){
    await this.storage.clear();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  navigateToProfilePage() {
    this.router.navigate(['/tabs/my-profile']);
  }

  navigateToAccountPage(){
    this.router.navigate(['/my-profile']);
  }

  navigateToPackage(){
    this.router.navigate(['/my-packages']);
  }

  navigateToTermCondition(){
    this.router.navigate(['/terms-condition']);
  }

  navigateToPrivacyPolicy(){
    this.router.navigate(['/privacy-policy']);
  }

  navigateToCancelPolicy(){
    this.router.navigate(['/cancelation-policy']);
  }

  navigateToFaq(){
    this.router.navigate(['/faq']);
  }
  
  navigateToContactus(){
    this.router.navigate(['/contact-us']);
  }

}
