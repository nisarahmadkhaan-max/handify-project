import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

interface RequestDetails {
  id: string;
  submitted: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-request-submitted',
  templateUrl: './request-submitted.page.html',
  styleUrls: ['./request-submitted.page.scss'],
  standalone: false
})
export class RequestSubmittedPage implements OnInit {
  phoneNumber: string = '1-800-123-4567';
  requestDetails: any = null;
  currentLang = 'en';

  constructor(public translationService: TranslationService, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const supportResponse = nav?.extras.state?.['supportResponse'];
    if (supportResponse) {
      this.requestDetails = supportResponse;
    }
  }

  ngOnInit() {
    this.translationService.currentLang$.subscribe((lang: string) => {
      this.currentLang = lang;
    });
  }

  backToHome() {
    this.router.navigate(['/tabs/tab1']);
  }

  switchLanguage(lang: string) {
    this.translationService.setLanguage(lang);
  }
}