import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  showFirstDiv: boolean = true;
  confirmbooking: boolean =true;
  showCancelStatus: boolean=true;
  constructor() {}
  toggleDivs() {
    this.showFirstDiv = !this.showFirstDiv;  // Toggle between true and false
  }
  proceed(){
    this.confirmbooking =!this.confirmbooking;
    this.showFirstDiv = true;
    setTimeout(() => {
      this.statuscheck();
    }, 3000);
  }
  statuscheck(){
    this.showFirstDiv = true;
    this.confirmbooking =true;
    this.showCancelStatus= false;
  }
}


