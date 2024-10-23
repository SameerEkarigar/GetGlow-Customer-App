import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PopupcomponentComponent } from '../myComponents/popupcomponent/popupcomponent.component';
@Injectable({
  providedIn: 'root'
})
export class PopupserviceService {


  constructor(private modalController: ModalController) {}
   
     async presentPopup() {
       const modal = await this.modalController.create({
         component: PopupcomponentComponent,
         cssClass: 'my-custom-class', // Optional custom CSS class
        //  swipeToClose: true,
        //  presentingElement: document.querySelector('ion-app')
       });
       return await modal.present();
     }
}
