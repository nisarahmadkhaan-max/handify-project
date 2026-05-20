import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.page.html',
  styleUrls: ['./tutorials.page.scss'],
  standalone: false
})
export class TutorialsPage {
  currentSlide: number = 0;

  constructor(
    private router: Router,
    private translationService: TranslationService,
    private platform: Platform
  ) {}

  ionViewWillEnter() {
    // Disable back button
    this.platform.backButton.subscribeWithPriority(100, () => {
      // Do nothing - effectively disabling the back button
    });
  }

  ionViewWillLeave() {
    // Re-enable back button when leaving the page
    this.platform.backButton.unsubscribe();
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  next() {
    if (this.currentSlide < 2) {
      this.currentSlide++;
    } else {
      this.finish();
    }
  }

  back() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  finish() {
    localStorage.setItem('onboardingComplete', 'true');
    this.router.navigateByUrl('/login');
  }
}
