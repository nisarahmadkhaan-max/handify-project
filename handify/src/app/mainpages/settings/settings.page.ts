import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit {
  settings = {
    notifications: {
      enabled: true,
      serviceUpdates: true,
      promotions: false,
      bookingReminders: true
    },
    location: {
      enabled: true,
      useCurrentLocation: true,
      manualAddress: ''
    }
  };

  showChangePassword = false;
  showLanguagePreferences = false;
  showAboutApp: boolean = false;

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordChangeMessage: string = '';

  availableLanguages = [
    { code: 'en', label: 'English' },
    { code: 'ur', label: 'اردو' }
  ];
  selectedLanguage: string = 'en';
  languageChangeMessage: string = '';
  currentLang = 'en';

  constructor(
    private router: Router,
    public translationService: TranslationService,
    private storage: Storage
  ) { }

  async ngOnInit() {
    await this.storage.create();
    this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.selectedLanguage = lang;
    });

    const lang = await this.storage.get('language');
    if (lang) {
      this.selectedLanguage = lang;
    }
  }

  goBack() {
    this.router.navigate(['/tabs/tab4']);
  }

  changePassword() {
    this.showChangePassword = !this.showChangePassword;
    this.showLanguagePreferences = false;
  }

  changeLanguage() {
    this.showLanguagePreferences = !this.showLanguagePreferences;
    this.showChangePassword = false;
  }

  submitPasswordChange() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordChangeMessage = 'Please fill in all fields.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordChangeMessage = 'New passwords do not match.';
      return;
    }
    this.passwordChangeMessage = 'Password changed successfully!';
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    setTimeout(() => {
      this.showChangePassword = false;
      this.passwordChangeMessage = '';
    }, 1500);
  }

  async submitLanguageChange() {
    await this.storage.set('language', this.selectedLanguage);
    this.translationService.setLanguage(this.selectedLanguage);
    this.languageChangeMessage = 'Language updated successfully!';

    setTimeout(() => {
      this.showLanguagePreferences = false;
      this.languageChangeMessage = '';
    }, 1500);
  }

  toggleSetting(category: string, setting: string) {
    // @ts-ignore
    this.settings[category][setting] = !this.settings[category][setting];
  }

  aboutApp() {
    this.showAboutApp = !this.showAboutApp;
  }

  contactSupport() {
    this.router.navigate(['/contact-support']);
  }
}
