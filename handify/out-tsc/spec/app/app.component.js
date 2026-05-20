import { __decorate } from "tslib";
import { Component } from '@angular/core';
let AppComponent = class AppComponent {
    constructor(platform, router, authService) {
        this.platform = platform;
        this.router = router;
        this.authService = authService;
        this.initializeApp();
    }
    async initializeApp() {
        await this.platform.ready();
        // Force light theme
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        // Handle Android status bar
        if (this.platform.is('android')) {
            // Add safe area padding for Android
            document.body.style.setProperty('--ion-safe-area-top', '24px');
        }
        await this.checkInitialNavigation();
    }
    async checkInitialNavigation() {
        const isLoggedIn = await this.authService.isLoggedIn();
        const hasSeenOnboarding = await this.authService.hasSeenOnboarding();
        if (isLoggedIn) {
            // If logged in, go directly to tabs
            this.router.navigateByUrl('/tabs/tab1');
        }
        else if (!hasSeenOnboarding) {
            // If not logged in and hasn't seen onboarding, start with splash
            this.router.navigateByUrl('/splash');
        }
        else {
            // If not logged in but has seen onboarding, go to login
            this.router.navigateByUrl('/login');
        }
    }
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: 'app.component.html',
        styleUrls: ['app.component.scss'],
        standalone: false,
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map