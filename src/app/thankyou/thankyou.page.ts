import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.page.html',
  styleUrls: ['./thankyou.page.scss'],
})
export class ThankyouPage implements OnInit {
  booking_id: any;
  tapId: any;

  constructor(private storage: Storage, private router: Router,private route: ActivatedRoute) { }

  async ngOnInit() {
    this.booking_id =  await this.storage.get('booking_id');
    console.log('booking_id', this.booking_id)
    localStorage.setItem('headerCart', '');
    localStorage.setItem('cart', ''); 
    localStorage.setItem('overallTotalAmount', '');

    this.route.queryParams.subscribe((params) => {
      this.tapId = params['tap_id'] || null;
      console.log('Received tap_id:', this.tapId);
    });
    if(this.tapId){
      localStorage.clear();
      setTimeout(() => {
        this.router.navigate(['/tabs/tab1']); // Replace 'home' with the target route
      }, 2000); // 2000ms = 2 seconds   
    }
  
  
  }

}
