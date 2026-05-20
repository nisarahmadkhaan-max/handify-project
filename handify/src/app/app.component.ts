import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    
    // Force light theme
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    
    // Handle Android status bar
    if (this.platform.is('android')) {
      document.body.style.setProperty('--ion-safe-area-top', '24px');
    }

    await this.checkInitialNavigation();

    // App open hote hi location update karne ka logic
    this.updateUserLocationOnStart();
  }

  async updateUserLocationOnStart() {
    const isLoggedIn = await this.authService.isLoggedIn();
    if (isLoggedIn) {
      try {
        const coordinates = await Geolocation.getCurrentPosition();
        const lat = coordinates.coords.latitude;
        const lng = coordinates.coords.longitude;

        // Reverse Geocoding to get address
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
        this.http.get(url).subscribe((res: any) => {
          const address = res?.display_name || `${lat}, ${lng}`;
          this.authService.updateLocation(address);
        });
      } catch (error) {
        console.error('Could not fetch location on start', error);
      }
    }
  }

  async checkInitialNavigation() {
    const isLoggedIn = await this.authService.isLoggedIn();
    // Assuming hasSeenOnboarding is handled elsewhere or adding a default
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding') === 'true';

    if (isLoggedIn) {
      this.router.navigateByUrl('/tabs/tab1');
    } else if (!hasSeenOnboarding) {
      this.router.navigateByUrl('/splash');
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
