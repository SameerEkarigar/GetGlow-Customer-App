import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { subscribeOn } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-my-packages',
  templateUrl: './my-packages.page.html',
  styleUrls: ['./my-packages.page.scss'],
})
export class MyPackagesPage implements OnInit {
  printPurchasedPackageData: any[]= [];
  printInnerPackgeData: any[] = [];
  package_id: any[]=[];
  noPackage: boolean = false;

  constructor(private router: Router, private apiService: ApiService, private Storage: Storage) { 
    this.init();
  }

  async init() {
    await this.Storage.create();
  }
  
  ngOnInit() {
    this.printPurchasedPackes();
    // this.printPurchasedPackageInner();
  }
  navigateToTab3(){
    this.router.navigate(['/tabs/tab3']);
  }
  // async printPurchasedPackes(){
  //   const user_id = await this.Storage.get('user_index_id'); 
  //   console.log(user_id)
  //   this.apiService.purchasedPackages(user_id).subscribe((response)=>{
  //     if(response.status === true){
  //       this.printPurchasedPackageData =  response.message;
  //       this.printPurchasedPackageData.forEach((packageItem: any) => {
  //         const package_id = packageItem.package_id;
  //         console.log(package_id) // Extract `package_id`
  //         this.printPurchasedPackageInner(package_id); // Call API for each package
  //       });
  //       console.log('purchased packages', response)
  //     }
  //   })
  // }
  // async printPurchasedPackageInner(package_id: any){
  //   const user_id = await this.Storage.get('user_index_id'); 
  //   this.apiService.purchasedInnerPackageData(user_id, package_id).subscribe((response)=>{
  //     if(response){
  //       this.printInnerPackgeData = response.message;
  //       console.log('purchased Inner packages', response)
  //     }
  //   })
  // }
  async printPurchasedPackes() {
    const user_id = await this.Storage.get('user_index_id');
    this.apiService.purchasedPackages(user_id).subscribe((response) => {
      if (response.status === true) {
        this.printPurchasedPackageData = response.message.map((packageItem: any) => ({
          ...packageItem,
          innerData: [], // Initialize an array for inner data
        }));
  
        // Fetch inner data for each package
        this.printPurchasedPackageData.forEach(async (packageItem: any) => {
          const package_id = packageItem.package_id;
          const innerData = await this.fetchPackageInnerData(user_id, package_id);
          packageItem.innerData = innerData; // Assign inner data to each package
        });
  
        console.log('purchased packages', this.printPurchasedPackageData);
      } else{
        this.noPackage = true;
      }
    });
  }
  
  // Helper to fetch inner data
  fetchPackageInnerData(user_id: any, package_id: any): Promise<any[]> {
    return new Promise((resolve) => {
      this.apiService.purchasedInnerPackageData(user_id, package_id).subscribe((response) => {
        resolve(response?.message || []); // Resolve with inner data or an empty array
      });
    });
  }
  
}
