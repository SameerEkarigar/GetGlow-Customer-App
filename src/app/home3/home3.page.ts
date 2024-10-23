import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { RecentReturnService } from '../services/recent-return.service';

@Component({
  selector: 'app-home3',
  templateUrl: './home3.page.html',
  styleUrls: ['./home3.page.scss'],
})
export class Home3Page implements OnInit {
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
    //     data => {
    //       const all_data = data;
    //       this.arr_data = all_data;
    //     } // For debugging purposes
    // );
  }

  splash_content_print(){
    this.loading = true;
    this.apiservice.get_splash_content().subscribe((response)=>{
      if(response.status == true){
        const ApiData = response.result; 
        const SingleData = ApiData[1];
        if(SingleData.status != 0){
          this.splashContent = SingleData;
        }else{
          this.router.navigate(['/home4']);
        }
        this.arr_data = response.result;
      }else{
        this.router.navigate(['/home4']);
      }
      this.loading = false
    });

    // this.apiservice.get_splash_content().subscribe(
    //   data => {
    //     const arrrdata  = data[1];
    //     const PageStatus=  arrrdata.status; 
    //     if(PageStatus != 0){
    //       this.splashContent = arrrdata;
    //     }  else{
    //       this.router.navigate(['/home4']);
    //     }
    //   }
    // );
  }

  navigateToThirdPage() {
    this.router.navigate(['/home4']);
  }

  navigateTolocation(){
    this.router.navigate(['/location-access']);
  }

}
