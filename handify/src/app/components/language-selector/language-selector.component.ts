import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [IonicModule, FormsModule],
  template: `
    <ion-item lines="none">
      <ion-label>{{ translate('PROFILE.LANGUAGE') }}</ion-label>
      <ion-select [(ngModel)]="currentLang" (ionChange)="onLanguageChange($event)">
        <ion-select-option value="en">{{ translate('ONBOARDING.LANGUAGE.ENGLISH') }}</ion-select-option>
        <ion-select-option value="ur">{{ translate('ONBOARDING.LANGUAGE.URDU') }}</ion-select-option>
      </ion-select>
    </ion-item>
  `,
  styles: [`
    ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
    }
    ion-select {
      max-width: 45%;
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  currentLang: string = 'en';

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    this.currentLang = this.translationService.getCurrentLangValue();
  }

  onLanguageChange(event: any) {
    this.translationService.setLanguage(event.detail.value);
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
} 