import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { TranslationService } from '../../services/translation.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Storage } from '@ionic/storage-angular';
import { PushNotifications } from '@capacitor/push-notifications';
import { Geolocation } from '@capacitor/geolocation';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: false
})
export class OnboardingPage implements OnInit {
  selected_onboard: string = 'first';
  selectedLanguage: string = 'en';

  constructor(
    private navCtrl: NavController,
    private translationService: TranslationService,
    private router: Router,
    private authService: AuthService,
    private storage: Storage,
    private platform: Platform,
    private toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    await this.storage.create();
    
    // Default language is English
    const lang = await this.storage.get('language');
    if (!lang) {
      this.selectedLanguage = 'en';
      await this.storage.set('language', 'en');
      this.translationService.setLanguage('en');
    } else {
      this.selectedLanguage = lang;
    }
  }

  async requestNotificationPermission(): Promise<boolean> {
    try {
      const permissionStatus = await PushNotifications.checkPermissions();
      if (permissionStatus.receive === 'granted') return true;
      const result = await PushNotifications.requestPermissions();
      return result.receive === 'granted';
    } catch (error) {
      return false;
    }
  }

  async requestLocationPermission(): Promise<boolean> {
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      if (permissionStatus.location === 'granted') return true;
      const result = await Geolocation.requestPermissions();
      return result.location === 'granted';
    } catch (error) {
      return false;
    }
  }

  async confirmSelection(next: string) {
    if (this.selected_onboard === 'second') {
      await this.requestNotificationPermission();
    } else if (this.selected_onboard === 'third') {
      await this.requestLocationPermission();
    }

    if (next === 'four') {
      await this.completeOnboarding();
    } else {
      this.selected_onboard = next;
    }
  }

  confirmSelectionnotallow(next: string) {
    if (next === 'four') {
      this.completeOnboarding();
    } else {
      this.selected_onboard = next;
    }
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  async completeOnboarding() {
    await this.authService.setHasSeenOnboarding();
    this.router.navigateByUrl('/login');
  }
}
