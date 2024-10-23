
import { DummyDataService } from '../services/dummy-data.service';
import { ApiService } from '../services/api.service';
import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
@Component({
  selector: 'app-abc',
  templateUrl: './abc.page.html',
  styleUrls: ['./abc.page.scss'],
})
export class AbcPage implements OnInit {
  @ViewChild('content') content: IonContent | null = null;
  @ViewChild('section1') section1: ElementRef | null = null;
  @ViewChild('section2') section2: ElementRef | null = null;
  @ViewChild('section3') section3: ElementRef | null = null;
  ngOnInit(): void {

    // this.dummyData = this.dummyDataService.getDummyData();
    // this.getDummyData();
  }


  constructor(private dummyDataService: DummyDataService, private apiService: ApiService) {
     // Initialize the week when the component is created
    //  this.dummyData = this.dummyDataService.getDummyData();
    this.section1 = new ElementRef(null);
  this.section2 = new ElementRef(null);
  this.section3 = new ElementRef(null);
  }

  
  scrollToSection(targetSection: ElementRef<any>) {
    // Perform scrolling logic using targetSection.nativeElement
  }


  
}
