import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Geolocation } from '@capacitor/geolocation';
let OnboardingPage = class OnboardingPage {
    constructor(navCtrl, translationService, router, authService, storage, platform, toastCtrl) {
        this.navCtrl = navCtrl;
        this.translationService = translationService;
        this.router = router;
        this.authService = authService;
        this.storage = storage;
        this.platform = platform;
        this.toastCtrl = toastCtrl;
        this.selected_onboard = 'first';
        this.selectedLanguage = 'en';
        this.isAndroid = false;
        this.isAndroid = this.platform.is('android');
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
    ngOnInit() {
        // Initialize storage
        this.storage.create();
        // Get saved language preference
        this.storage.get('language').then((lang) => {
            if (lang) {
                this.selectedLanguage = lang;
                this.translationService.setLanguage(lang);
            }
            else {
                this.onLanguageChange();
            }
        });
    }
    async openAppSettings() {
        await this.showToast('Please open your device settings and enable the required permissions for this app.');
    }
    async requestNotificationPermission() {
        try {
            const permissionStatus = await PushNotifications.checkPermissions();
            if (permissionStatus.receive === 'granted') {
                await this.storage.set('notifications_enabled', true);
                return true;
            }
            const result = await PushNotifications.requestPermissions();
            if (result.receive === 'granted') {
                await this.storage.set('notifications_enabled', true);
                // await this.showToast(this.translate('PERMISSIONS.NOTIFICATIONS_GRANTED'));
                return true;
            }
            else {
                await this.storage.set('notifications_enabled', false);
                // await this.showToast(this.translate('PERMISSIONS.NOTIFICATIONS_DENIED'));
                return false;
            }
        }
        catch (error) {
            console.error('Error requesting notification permission:', error);
            await this.storage.set('notifications_enabled', false);
            return false;
        }
    }
    setupNotificationListeners() {
        // On successful registration
        PushNotifications.addListener('registration', (token) => {
            console.log('Push registration success:', token.value);
            this.storage.set('push_token', token.value).catch(err => {
                console.error('Error saving push token:', err);
            });
        });
        // On registration error
        PushNotifications.addListener('registrationError', (error) => {
            console.error('Error on registration:', error);
        });
        // On push received
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Push notification received:', notification);
        });
        // On push clicked
        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            console.log('Push notification action performed:', notification);
        });
    }
    async requestLocationPermission(type) {
        try {
            const permissionStatus = await Geolocation.checkPermissions();
            if (permissionStatus.location === 'granted') {
                await this.storage.set('location_enabled', true);
                return true;
            }
            const result = await Geolocation.requestPermissions();
            if (result.location === 'granted') {
                const coordinates = await Geolocation.getCurrentPosition();
                console.log('Current position:', coordinates);
                await this.storage.set('location_enabled', true);
                // await this.showToast(this.translate('PERMISSIONS.LOCATION_GRANTED'));
                return true;
            }
            else {
                await this.storage.set('location_enabled', false);
                // await this.showToast(this.translate('PERMISSIONS.LOCATION_DENIED'));
                await this.openAppSettings();
                return false;
            }
        }
        catch (error) {
            console.error('Error requesting location permission:', error);
            await this.storage.set('location_enabled', false);
            await this.openAppSettings();
            return false;
        }
    }
    async showToast(message) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'bottom'
        });
        await toast.present();
    }
    confirmSelectionnotallow(next) {
        // this.selected_onboard = next;
        if (next === 'four') {
            this.completeOnboarding();
        }
        else {
            this.selected_onboard = next;
        }
    }
    async confirmSelection(next) {
        if (this.selected_onboard === 'first') {
            await this.storage.set('language', this.selectedLanguage);
            this.translationService.setLanguage(this.selectedLanguage);
        }
        else if (this.selected_onboard === 'second') {
            const notificationAllowed = await this.requestNotificationPermission();
            await this.storage.set('notifications_enabled', notificationAllowed);
            if (!notificationAllowed) {
                // If notifications were denied, stay on the same screen
                return;
            }
        }
        else if (this.selected_onboard === 'third') {
            const locationAllowed = await this.requestLocationPermission('while-using');
            await this.storage.set('location_enabled', locationAllowed);
            if (!locationAllowed) {
                // If location was denied, stay on the same screen
                return;
            }
        }
        if (next === 'four') {
            await this.completeOnboarding();
        }
        else {
            this.selected_onboard = next;
        }
    }
    translate(key) {
        return this.translationService.translate(key);
    }
    async completeOnboarding() {
        await this.authService.setHasSeenOnboarding();
        this.router.navigateByUrl('/tutorials');
    }
    onLanguageChange() {
        // Update language immediately when changed
        this.translationService.setLanguage(this.selectedLanguage);
    }
};
OnboardingPage = __decorate([
    Component({
        selector: 'app-onboarding',
        templateUrl: './onboarding.page.html',
        styleUrls: ['./onboarding.page.scss'],
        standalone: false
    })
], OnboardingPage);
export { OnboardingPage };
//# sourceMappingURL=onboarding.page.js.map