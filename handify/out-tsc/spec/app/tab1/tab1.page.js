import { __decorate } from "tslib";
import { Component } from '@angular/core';
let Tab1Page = class Tab1Page {
    constructor(router, translationService, categoryService) {
        this.router = router;
        this.translationService = translationService;
        this.categoryService = categoryService;
        this.categories = [];
        this.currentLang = 'en';
    }
    ngOnInit() {
        this.translationService.currentLang$.subscribe(lang => {
            this.currentLang = lang;
        });
        this.loadFeaturedCategories();
    }
    loadFeaturedCategories() {
        this.categoryService.getFeaturedCategories(3).subscribe({
            next: (categories) => {
                this.categories = categories;
            },
            error: (error) => {
                console.error('Error loading featured categories:', error);
            }
        });
    }
    switchLanguage(lang) {
        this.translationService.setLanguage(lang);
    }
    bookService() {
        console.log('Book a service clicked');
        // Add your navigation or modal logic here
        this.router.navigate(['/tabs/tab2']);
    }
    viewHistory() {
        console.log('View history clicked');
        // Add your navigation logic here
        this.router.navigate(['/service-history']);
    }
    bookingDetails() {
        console.log('Booking details clicked');
        // Add your navigation logic here
        this.router.navigate(['/tabs/tab3']);
    }
    contactSupport() {
        console.log('Contact support clicked');
        this.router.navigate(['/contact-support']);
    }
    bookNow() {
        console.log('Book now clicked');
        // Add your booking flow logic here
    }
    goToNoti() {
        this.router.navigate(['/notification']);
    }
    goTOChat() {
        this.router.navigate(['/live-chat']);
    }
    viewAll() {
        this.router.navigate(['/tabs/tab2']);
    }
    getCat() {
        this.router.navigate(['/tabs/servicepage']);
    }
    search() {
        this.router.navigate(['/tabs/tab2'], {
            queryParams: { focus: 'search' }
        });
    }
};
Tab1Page = __decorate([
    Component({
        selector: 'app-tab1',
        templateUrl: './tab1.page.html',
        styleUrls: ['./tab1.page.scss'],
        standalone: false
    })
], Tab1Page);
export { Tab1Page };
//# sourceMappingURL=tab1.page.js.map