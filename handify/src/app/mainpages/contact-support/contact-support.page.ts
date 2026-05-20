import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { TranslationService } from '../../services/translation.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-contact-support',
  templateUrl: './contact-support.page.html',
  styleUrls: ['./contact-support.page.scss'],
  standalone: false
})
export class ContactSupportPage implements OnInit {
  phoneNumber: string = '03311381479';
  emailAddress: string = 'handifyservice@gmail.com';
  supportRequest = {
    subject: '',
    message: ''
  };
  currentLang = 'en';

  constructor(private router: Router, private apiService: ApiService, private alertController: AlertController, public translationService: TranslationService) { }

  ngOnInit() {
    this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  callNow() {
    window.open(`tel:${this.phoneNumber.replace(/-/g, '')}`);
  }

  sendEmail() {
    window.open(`mailto:${this.emailAddress}`);
  }

  async submitRequest() {
    try {
      const response = await this.apiService.submitContactSupportRequest(this.supportRequest).toPromise();
      this.router.navigate(['/request-submitted'], { state: { supportResponse: response } });
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'There was a problem submitting your request. Please try again later.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  switchLanguage(lang: string) {
    this.translationService.setLanguage(lang);
  }
}