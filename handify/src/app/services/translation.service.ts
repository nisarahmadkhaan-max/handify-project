import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = new BehaviorSubject<string>('en');
  private translations: { [key: string]: any } = {};
  private storage: Storage | null = null;
  currentLang$ = this.currentLang.asObservable();

  constructor(
    private http: HttpClient,
    private storageService: Storage
  ) {
    this.initStorage();
  }

  private async initStorage() {
    this.storage = await this.storageService.create();
    const savedLang = await this.storage.get('language');
    if (savedLang) {
      await this.setLanguage(savedLang);
    } else {
      await this.setLanguage('en'); // Set default language
    }
  }

  private loadTranslations(lang: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get(`/assets/i18n/${lang}.json`).pipe(
        catchError(error => {
          console.error('Error loading translations:', error);
          return of({});
        })
      ).subscribe(
        (data: any) => {
          this.translations[lang] = data;
          this.storage?.set('language', lang);
          resolve();
        },
        error => {
          console.error('Error loading translations:', error);
          reject(error);
        }
      );
    });
  }

  async setLanguage(lang: string) {
    await this.loadTranslations(lang);
    this.currentLang.next(lang);
  }

  getCurrentLang(): Observable<string> {
    return this.currentLang.asObservable();
  }

  getCurrentLangValue(): string {
    return this.currentLang.value;
  }

  private getNestedTranslation(obj: any, path: string): string {
    return path.split('.').reduce((o, i) => o?.[i], obj) || path;
  }

  getTranslation(key: string): string {
    const lang = this.currentLang.value;
    return this.getNestedTranslation(this.translations[lang], key) || key;
  }

  translate(key: string): string {
    return this.getTranslation(key);
  }
} 