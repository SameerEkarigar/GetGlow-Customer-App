import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-know-more-modal',
  templateUrl: './know-more-modal.component.html',
  styleUrls: ['./know-more-modal.component.scss'],
})
export class KnowMoreModalComponent  implements OnInit {
  addbtn: boolean = false;
  presentingElement: any = null;
  serviceData: any;
  wahtIncludeData: any;  // Will hold the data passed from the parent component
  servicePageDescription: any;
  // servicePageDescriptionSplit: any;
  servicePAgeDEscriptionArray: any;
  featuresDataArray: any;
  ourProfVideoData: any;
  whatincludeData: any;
  getBeforeYoubookData: any;
  packageInnerDescription: any;
  packageFeatureData: any;
  packageInnerVideo: any
  packageInnerWhatWeGet: any
  packageInnerWhatWeInclude: any;
  packageInnerBeforeYouBook: any;
  service_type: any;
  ifPackage: boolean = false;
  // serviceId: string; 
  constructor(private modalController: ModalController, private apiService: ApiService,private navParams: NavParams) { }
  
  ngOnInit() {
        // Get the data passed from the parent component
        this.service_type = this.navParams.get('service_type');
        if(this.service_type === 'package'){
           this.ifPackage = true;
        }else{
          this.ifPackage = false;
        }
        this.packageInnerDescription =   this.navParams.get('packageInnerDescription');
        this.packageFeatureData =   this.navParams.get('packageFeatureData');
        this.packageInnerVideo =   this.navParams.get('packageInnerVideo');
        this.packageInnerWhatWeGet = this.navParams.get('packageInnerWhatWeGet');
        this.packageInnerWhatWeInclude = this.navParams.get('packageInnerWhatWeInclude');
        this.packageInnerBeforeYouBook = this.navParams.get('packageInnerBeforeYouBook');
        
        console.log('packageInnerDescription', this.packageInnerDescription);
        console.log('packageFeatureData', this.packageFeatureData);
        console.log('packageInnerVideo', this.packageInnerVideo);
        console.log('packageInnerWhatWeGet', this.packageInnerWhatWeGet);
        console.log('packageInnerWhatWeInclude', this.packageInnerWhatWeInclude);
        console.log('packageInnerBeforeYouBook', this.packageInnerBeforeYouBook);
        console.log('service_type', this.service_type);
        
        this.serviceData = this.navParams.get('serviceData');
        this.wahtIncludeData = this.navParams.get('wahtIncludeData');
        this.servicePageDescription = this.navParams.get('servicePageDescription');
        // this.servicePageDescriptionSplit = this.navParams.get('servicePageDescriptionSplit');
        this.servicePAgeDEscriptionArray = this.navParams.get('servicePAgeDEscriptionArray');
        this.featuresDataArray = this.navParams.get('featuresData');
        this.ourProfVideoData = this.navParams.get('ourProfVideoData');
        this.whatincludeData = this.navParams.get('whatincludeData');
        this.getBeforeYoubookData = this.navParams.get('getBeforeYoubookData');
        //console.log(this.getBeforeYoubookData);
  }
 // Property to store service_id
  
  close() {
    this.modalController.dismiss();
  }
  quantity = 1;
  showcart: boolean = false;
  deductquantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
    else {
      this.addbtn = false;
      this.showcart = false;
    }
  }
  increasequantity() {
    this.quantity++;
  }
  showbtn() {
    this.addbtn = true;
    this.showcart = true;
  }
}
