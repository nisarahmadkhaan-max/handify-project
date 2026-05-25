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
    
    if (this.platform.is('android')) {
      document.body.style.setProperty('--ion-safe-area-top', '24px');
    }

    await this.checkInitialNavigation();

    // Watch for Auth changes: Whenever user logs in, trigger location update
    this.authService.currentUser.subscribe(userData => {
      if (userData && userData.token) {
        // If user is logged in but location is not set, or we want to refresh it
        this.updateUserLocation();
      }
    });
  }

  async updateUserLocation() {
    try {
      // This will trigger the "While using this app" permission dialog
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;

      // Reverse Geocoding using OpenStreetMap (Free)
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

      this.http.get(url).subscribe((res: any) => {
        if (res && res.address) {
          const addr = res.address;
          // Creating a clean readable address: "Area, City, Country"
          const cleanAddress = [
            addr.suburb || addr.neighbourhood || addr.road || '',
            addr.city || addr.town || addr.village || '',
            addr.country || ''
          ].filter(val => !!val).join(', ');

          // Update in AuthService (which syncs with Backend)
          this.authService.updateLocation(cleanAddress || res.display_name);
        }
      });
    } catch (error) {
      console.warn('Location permission denied or error:', error);
    }
  }

  async checkInitialNavigation() {
    const isLoggedIn = await this.authService.isLoggedIn();
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
