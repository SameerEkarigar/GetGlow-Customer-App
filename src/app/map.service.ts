import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { GeocodingService } from './geocoding.service'; // Adjust the path as needed

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private geocodingService: GeocodingService) {}
  
  async getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
    const position = await Geolocation.getCurrentPosition();
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  }

  async reverseGeocode(lat: number, lng: number) {
    return this.geocodingService.reverseGeocode(lat, lng).toPromise();
  }

}