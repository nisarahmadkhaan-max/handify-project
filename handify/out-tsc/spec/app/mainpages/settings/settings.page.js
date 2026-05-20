import { __decorate } from "tslib";
import { Component } from '@angular/core';
let SettingsPage = class SettingsPage {
    constructor(router) {
        this.router = router;
        this.settings = {
            notifications: {
                enabled: true,
                serviceUpdates: true,
                promotions: false,
                bookingReminders: true
            },
            location: {
                enabled: true,
                useCurrentLocation: true,
                manualAddress: ''
            }
        };
    }
    ngOnInit() {
    }
    goBack() {
        this.router.navigate(['/my-profile']);
    }
    changePassword() {
        // Navigate to change password page
        alert('Change password functionality would open here');
    }
    changeLanguage() {
        // Navigate to language preferences page
        alert('Language preferences functionality would open here');
    }
    toggleSetting(category, setting) {
        // @ts-ignore - Using dynamic property access
        this.settings[category][setting] = !this.settings[category][setting];
        // If main notification toggle is turned off, disable all sub-notifications
        if (category === 'notifications' && setting === 'enabled' && !this.settings.notifications.enabled) {
            this.settings.notifications.serviceUpdates = false;
            this.settings.notifications.promotions = false;
            this.settings.notifications.bookingReminders = false;
        }
        // If location services are disabled, disable current location
        if (category === 'location' && setting === 'enabled' && !this.settings.location.enabled) {
            this.settings.location.useCurrentLocation = false;
        }
    }
    aboutApp() {
        // Navigate to about app page
        alert('About app information would open here');
    }
    sendFeedback() {
        // Navigate to feedback form
        alert('Feedback form would open here');
    }
    contactSupport() {
        this.router.navigate(['/contact-support']);
    }
};
SettingsPage = __decorate([
    Component({
        selector: 'app-settings',
        templateUrl: './settings.page.html',
        styleUrls: ['./settings.page.scss'],
        standalone: false
    })
], SettingsPage);
export { SettingsPage };
//# sourceMappingURL=settings.page.js.map