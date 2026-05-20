import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
let TranslationService = class TranslationService {
    constructor(http, storageService) {
        this.http = http;
        this.storageService = storageService;
        this.currentLang = new BehaviorSubject('en');
        this.translations = {};
        this.storage = null;
        this.currentLang$ = this.currentLang.asObservable();
        this.initStorage();
    }
    async initStorage() {
        this.storage = await this.storageService.create();
        const savedLang = await this.storage.get('language');
        if (savedLang) {
            await this.setLanguage(savedLang);
        }
        else {
            await this.setLanguage('en'); // Set default language
        }
    }
    loadTranslations(lang) {
        return new Promise((resolve, reject) => {
            this.http.get(`/assets/i18n/${lang}.json`).pipe(catchError(error => {
                console.error('Error loading translations:', error);
                return of({});
            })).subscribe((data) => {
                this.translations[lang] = data;
                this.storage?.set('language', lang);
                resolve();
            }, error => {
                console.error('Error loading translations:', error);
                reject(error);
            });
        });
    }
    async setLanguage(lang) {
        await this.loadTranslations(lang);
        this.currentLang.next(lang);
    }
    getCurrentLang() {
        return this.currentLang.asObservable();
    }
    getCurrentLangValue() {
        return this.currentLang.value;
    }
    getNestedTranslation(obj, path) {
        return path.split('.').reduce((o, i) => o?.[i], obj) || path;
    }
    getTranslation(key) {
        const lang = this.currentLang.value;
        return this.getNestedTranslation(this.translations[lang], key) || key;
    }
    translate(key) {
        return this.getTranslation(key);
    }
};
TranslationService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], TranslationService);
export { TranslationService };
//# sourceMappingURL=translation.service.js.map