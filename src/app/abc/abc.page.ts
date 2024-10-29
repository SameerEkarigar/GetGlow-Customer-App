import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { GeocodingService } from '../geocoding.service';

@Component({
  selector: 'app-abc',
  templateUrl: './abc.page.html',
  styleUrls: ['./abc.page.scss'],
})
export class AbcPage implements OnInit {
  map: google.maps.Map | undefined;
  address: string = '';

  constructor(private geocodingService: GeocodingService) {}

  ngOnInit(): void {
   
  }
  selectedValue: number = 1;
  
  onRadioSelect(value: number) {
    this.selectedValue = value;
    console.log('sery',this.selectedValue);
  }

}
