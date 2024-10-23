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
    this.splash_content_print();
    // this.apiservice.get_splash_content().subscribe(
    //   data => {
    //     const all_data = data;
    //     this.arr_data = all_data;
    //   } // For debugging purposes
    // );
  }
  splash_content_print(){
    this.loading = true;
    this.apiservice.get_splash_content().subscribe((response)=>{ 
      if(response.status == true){
        const ApiData = response.result; 
        const SingleData = ApiData[2];
        if(SingleData.status != 0){
          this.splashContent = SingleData;
        }else{
          this.router.navigate(['/complete-login']);
        }
        this.arr_data = response.result;
      }else{
        this.router.navigate(['/complete-login']);
      }
      this.loading = false;
    });

    // this.apiservice.get_splash_content().subscribe(
    //   data => {
    //     const arrrdata  = data[2];
    //     const PageStatus=  arrrdata.status; 
    //     if(PageStatus != 0){
    //       this.splashContent = arrrdata;
    //     }  else{
    //       this.router.navigate(['/complete-login']);
    //     }
    //   }
    // );
  }
  redirectToLocationAcces(){
      this.router.navigate(['/location-access']);
  } 
  navigateTolocation(){
    this.router.navigate(['/location-access']);
}
  
}
