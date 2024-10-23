import { Component, OnInit } from '@angular/core';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Capacitor } from '@capacitor/core';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';
import { Router } from '@angular/router';
import { LoadingServiceService } from '../services/loading-service.service';

@Component({
  selector: 'app-location-access',
  templateUrl: './location-access.page.html',
  styleUrls: ['./location-access.page.scss'],
  providers: [
    LocationAccuracy,
  ],
})
export class LocationAccessPage implements OnInit {
  loading = true;
  settingsOpened = false; // Track if the settings were opened

  constructor(private locationAccuracy: LocationAccuracy, private router: Router, private loadingService: LoadingServiceService) { }

  ngOnInit() {
    this.getCurrentLocation();
  }

  async getCurrentLocation() {
    try {
      this.loadingService.presentLoading();

      const permissionStatus = await Geolocation.checkPermissions();

      if (permissionStatus?.location !== 'granted') {
        const requestStatus = await Geolocation.requestPermissions();
        if (requestStatus.location !== 'granted') {
          // Go to location settings if permission is still not granted
          await this.openSettings(true);
          return;
        }
      } else {
        // Permission is granted; check if the user should be prompted for "while using the app" (iOS)
        if (Capacitor.getPlatform() === 'ios') {
          // Example for iOS, prompt user again for precise location access
          const status = await Geolocation.requestPermissions();
          if (status.location !== 'granted') {
            await this.openSettings(true);
            return;
          }
        }
      }

      if (Capacitor.getPlatform() === 'android') {
        await this.enableGps();
      }

      let options: PositionOptions = {
        maximumAge: 3000,
        timeout: 10000,
        enableHighAccuracy: true
      };

      const position = await Geolocation.getCurrentPosition(options);
      this.loadingService.dismissLoading();
      this.router.navigate(['/login']); // Replace '/target-page' with your actual route
    } catch (e: any) {
      if (e?.message === 'Location services are not enabled') {
        await this.openSettings();
      }
    }
  }

  async openSettings(app = false) {
    this.settingsOpened = true; // Mark that settings were opened

    await NativeSettings.open({
      optionAndroid: app ? AndroidSettings.ApplicationDetails : AndroidSettings.Location, 
      optionIOS: app ? IOSSettings.App : IOSSettings.LocationServices
    });

    // Re-check location status when coming back from settings
    if (this.settingsOpened) {
      this.settingsOpened = false; // Reset the flag
      this.getCurrentLocation(); // Re-check location status
    }
  }

  async enableGps() {
    const canRequest = await this.locationAccuracy.canRequest();
    if (canRequest) {
      await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
    }
  }
}
