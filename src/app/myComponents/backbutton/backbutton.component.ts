import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-backbutton',
  templateUrl: './backbutton.component.html',
  styleUrls: ['./backbutton.component.scss'],
})
export class BackbuttonComponent  implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {}
  goBackarrow() {
    this.navCtrl.back(); // Navigates back to the previous page
  }
}
