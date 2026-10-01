import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecentReturnService } from '../services/recent-return.service';

@Component({
  selector: 'app-home4',
  templateUrl: './home4.page.html',
  styleUrls: ['./home4.page.scss'],
})
export class Home4Page implements OnInit {
  splashContent: any;
  checkArrayLength: any;
  statusCount: number =0;
  splash_id: number= 0;
  isActive: boolean = false;
  loading: boolean = false;
  arr_data: any;
  constructor(private router: Router, private apiservice: ApiService, private recentreturn: RecentReturnService) { }

  ngOnInit() {
  
  }
  
  redirectToLocationAcces(){
      this.router.navigate(['/location-access']);
  } 
  navigateTolocation(){
    this.router.navigate(['/location-access']);
}
  
}
