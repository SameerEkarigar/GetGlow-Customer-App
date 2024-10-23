import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class RecentReturnService {

  constructor(private navCtrl: NavController) { }
  goBack() {
    this.navCtrl.back(); // Navigates back to the previous page
  }
}
