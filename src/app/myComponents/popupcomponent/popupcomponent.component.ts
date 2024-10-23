import { Component, OnInit } from '@angular/core';
import { PopupserviceService } from 'src/app/services/popupservice.service';
@Component({
  selector: 'app-popupcomponent',
  templateUrl: './popupcomponent.component.html',
  styleUrls: ['./popupcomponent.component.scss'],
})
export class PopupcomponentComponent  implements OnInit {
  constructor(private popupService: PopupserviceService) {} 
  
     openPopup() {
       this.popupService.presentPopup();
     }
     

  ngOnInit() {}

}
