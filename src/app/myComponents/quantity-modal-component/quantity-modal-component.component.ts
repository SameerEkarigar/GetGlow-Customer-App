
import { Component, Input ,OnInit} from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-quantity-modal-component',
  templateUrl: './quantity-modal-component.component.html',
  styleUrls: ['./quantity-modal-component.component.scss'],
})
export class QuantityModalComponentComponent  implements OnInit {

 

  ngOnInit() {}
  @Input() quantity: any;
  @Input() index: any;

  constructor(private modalController: ModalController) {}

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

  close() {
    this.modalController.dismiss({
      quantity: this.quantity
    });
  }
}
