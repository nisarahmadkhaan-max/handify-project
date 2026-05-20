import { __decorate } from "tslib";
import { Component } from '@angular/core';
let TutorialsPage = class TutorialsPage {
    constructor(router, translationService, platform) {
        this.router = router;
        this.translationService = translationService;
        this.platform = platform;
        this.currentSlide = 0;
    }
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
    translate(key) {
        return this.translationService.translate(key);
    }
    next() {
        if (this.currentSlide < 2) {
            this.currentSlide++;
        }
        else {
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
};
TutorialsPage = __decorate([
    Component({
        selector: 'app-tutorials',
        templateUrl: './tutorials.page.html',
        styleUrls: ['./tutorials.page.scss'],
        standalone: false
    })
], TutorialsPage);
export { TutorialsPage };
//# sourceMappingURL=tutorials.page.js.map