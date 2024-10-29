import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-backbutton',
  templateUrl: './backbutton.component.html',
  styleUrls: ['./backbutton.component.scss'],
})
export class BackbuttonComponent  implements OnInit {

  constructor(private navCtrl: NavController,private router: Router) { }

  ngOnInit() {}
  goBackarrow() {
    this.navCtrl.back();
        // Reload the previous page after a brief delay
        // setTimeout(() => {
        //   const currentUrl = this.router.url;
        //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        //     this.router.navigate([currentUrl]);
        //   });
        // }, 100); // Adjust delay if necessary // Navigates back to the previous page
  }
  // goBackarrow() {
  //   this.navCtrl.navigateBack('/first-page', {
  //     queryParams: { refresh: 'true' }
  //   });
  // }
  
}
