import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-cancelation-policy',
  templateUrl: './cancelation-policy.page.html',
  styleUrls: ['./cancelation-policy.page.scss'],
})
export class CancelationPolicyPage implements OnInit {
  cancellationPolicyData: any;

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.cancellationPolicy();
  } 
  navigateToTab3(){
    this.router.navigate(['/tabs/tab3']);
  }
   cancellationPolicy(){
    this.apiService.getCancellationPolicy().subscribe((response)=>{
      this.cancellationPolicyData= response;
    })
   }
}
