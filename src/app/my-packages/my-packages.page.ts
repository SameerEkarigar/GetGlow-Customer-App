import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-packages',
  templateUrl: './my-packages.page.html',
  styleUrls: ['./my-packages.page.scss'],
})
export class MyPackagesPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  navigateToTab3(){
    this.router.navigate(['/tabs/tab3']);
  }
}
