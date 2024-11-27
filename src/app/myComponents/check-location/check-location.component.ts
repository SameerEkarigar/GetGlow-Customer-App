import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@angular/cdk/platform';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-check-location',
  templateUrl: './check-location.component.html',
  styleUrls: ['./check-location.component.scss'],
})
export class CheckLocationComponent  implements OnInit {

  constructor(private platform: Platform) { }

  ngOnInit() {
     this.checkLocationAndExit();
  }
  async checkLocationAndExit() {
    try {
      // Check if the platform is Android or iOS
      if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
        // Check location permissions
        const permissionStatus = await Geolocation.checkPermissions();
        if (permissionStatus.location !== 'granted') {
          //console.log('Location permission is not granted.');
          this.exitApp(); // Exit the app if location is not granted
          return;
        }

        try {
          // Attempt to get the current position
          await Geolocation.getCurrentPosition();
          //console.log('Location services are enabled.');
        } catch (error: unknown) {
          // Handle case where location services are not enabled
          if (error instanceof Error && error.message === 'Location services are not enabled') {
            //console.log('Location services are disabled.');
            this.exitApp(); // Exit the app if location services are disabled
          } else {
            console.error('Error getting location:', error);
          }
        }
      } else {
        // For other platforms like web, handle accordingly
        //console.log('Platform not supported for location services check.');
      }
    } catch (error: unknown) {
      // General error handling
      console.error('Error checking location status:', error);
    }
  }

  private exitApp() {
    if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
      // Use Capacitor's App plugin to exit the app 
      App.exitApp();
    } else {
      //console.log('Exiting app is not supported on this platform.');
    }
  }
}
