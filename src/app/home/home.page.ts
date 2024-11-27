import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router, private storage: Storage) {
   this.init();
   }

  characterId = 'next';
  async init() {
    await this.storage.create();
  }

 async ngOnInit() {
    this.navigateToAnotherPage();
    const phone = await this.storage.get('PhoneNumber');
    // console.log(phone);
  }
  
 async navigateToAnotherPage() {
    const phone = await this.storage.get('PhoneNumber');
    setTimeout(() => {
      if(phone){
        this.router.navigate(['/tabs/tab1']);
      } else{
        this.router.navigate(['/home2',this.characterId]);
      }
    
    }, 1000);
  }
}
