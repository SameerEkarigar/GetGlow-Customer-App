import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from '@capacitor-community/http';
import { environment } from 'src/environments/environment';
declare var Tap: any;
@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  // private serverUrl = 'http://localhost:3000/create-payment'; // Backend server URL
  // private serverUrl = 'https://ek-reps.com:8080/create-payment'; 
  
  private serverUrl = 'https://dashboard.getglowsalon.ae/staging/cms_app_api/api/temp_testing'; 
  constructor(private http: HttpClient) {}

  createPayment(amount: number, booking_type: any, user_id: any) {
    
    return this.http.post(`${this.serverUrl}`, {
        amount,
        booking_type,
        user_id,
    });
}
}