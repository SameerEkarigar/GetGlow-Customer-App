import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { RecentReturnService } from '../services/recent-return.service';
@Component({
  selector: 'app-home2',
  templateUrl: './home2.page.html',
  styleUrls: ['./home2.page.scss'],
})
export class Home2Page implements OnInit {
 
  checkArrayLength: any;
  arr_data: any[] = [];
  statusCount: number =0;
  splash_id: number = 0;
  lastUrl: any;
  loading: boolean = false;
  constructor(private router: Router) { }

  ngOnInit() {
    // this.splash_content_print();
   
    const fullUrl = this.router.url;
    const urlSegments = fullUrl.split('/');  // Split the URL by "/"
    this.lastUrl = urlSegments[urlSegments.length - 1];  // Get the last segment
  }

  navigateToSecondPage() { 
      this.router.navigate(['/home3']);  
  }

  navigateToFinalPage(){
    this.router.navigate(['/home4']);
  }

  navigateTolocation(){
      this.router.navigate(['/location-access']);
  }

}
