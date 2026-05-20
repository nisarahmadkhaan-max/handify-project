import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: false
})
export class SplashPage implements AfterViewInit {

  constructor(
    private router: Router,
    private storage: Storage,
    private authService: AuthService
  ) { }

  async ngAfterViewInit() {
    await this.storage.create();

    // Default language logic
    const savedLang = await this.storage.get('language');
    if (!savedLang) {
      await this.storage.set('language', 'en');
    }

    // Standard 2-second delay for branding
    setTimeout(async () => {
      const isLoggedIn = await this.authService.isLoggedIn();
      const hasSeenOnboarding = await this.authService.hasSeenOnboarding();

      if (isLoggedIn) {
        this.router.navigateByUrl('/tabs/tab1');
      } else if (hasSeenOnboarding) {
        this.router.navigateByUrl('/login');
      } else {
        this.router.navigateByUrl('/onboarding');
      }
    }, 2000);
  }
}
