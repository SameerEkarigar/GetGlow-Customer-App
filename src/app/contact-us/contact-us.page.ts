import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  contactUsData: any;

  constructor(private navCtrl: NavController, private apiService: ApiService) { }

  ngOnInit() {
    this.printContactUsData();
  }
   printContactUsData(){
    this.apiService.getContactUsData().subscribe((response)=>{
      if(response){
        this.contactUsData = response;
        // this.contactUsData = response;
      }
    })
   }
}
