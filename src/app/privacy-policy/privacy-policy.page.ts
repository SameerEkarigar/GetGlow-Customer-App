import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {
  privacyPolicyData: any;

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.privacyPolicy();
  }
  navigateToTab3(){
    this.router.navigate(['/tabs/tab3']);
  }
  privacyPolicy(){
    this.apiService.getPrivacyPolicy().subscribe((response)=>{
      if(response){
        this.privacyPolicyData = response;
      }
    })
  }
}
