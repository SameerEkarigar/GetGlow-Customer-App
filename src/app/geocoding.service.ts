import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private apiKey = 'AIzaSyCO3kYVYXk47s-_lKwlf1G4y1sG5HW8ySs'; // Replace with your actual API key

  constructor(private http: HttpClient) { }

  reverseGeocode(lat: number, lng: number): Observable<any> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;
    return this.http.get(url);
  }
}
