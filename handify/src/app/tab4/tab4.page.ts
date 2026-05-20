import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TranslationService } from '../services/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false
})
export class Tab4Page implements OnInit, OnDestroy {
  userProfile = {
    name: '',
    tagline: 'Handify Member',
    email: '',
    phone: 'Not Provided',
    location: 'No Location Set'
  };
  
  appVersion = '1.0';
  currentLang = 'en';
  private userSub: Subscription | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    public translationService: TranslationService
  ) { }

  ngOnInit() {
    this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });

    // Subscribe to user data for real-time updates
    this.userSub = this.authService.currentUser.subscribe(data => {
      if (data && data.user) {
        this.updateProfileFields(data.user);
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  ionViewWillEnter() {
    // Double check on enter
    const userData = this.authService.currentUserValue?.user;
    if (userData) {
      this.updateProfileFields(userData);
    }
  }

  updateProfileFields(userData: any) {
    this.userProfile = {
      name: userData.fullName || 'User',
      tagline: 'Handify Member',
      email: userData.email || '',
      // Handling null or empty strings properly
      phone: (userData.phoneNumber && userData.phoneNumber !== 'null') ? userData.phoneNumber : 'Not Provided',
      location: (userData.location && userData.location !== 'null') ? userData.location : 'No Location Set'
    };
  }

  closeProfile() {
    this.router.navigate(['/tabs/tab1']);
  }

  editProfile() {
    this.router.navigate(['tabs/tab4/edit-profile']);
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openTerms() {
    alert('Terms of Service');
  }

  openPrivacy() {
    alert('Privacy Policy');
  }

  switchLanguage(lang: string) {
    this.translationService.setLanguage(lang);
  }
}
