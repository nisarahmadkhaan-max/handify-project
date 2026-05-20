import { __decorate } from "tslib";
import { Component } from '@angular/core';
let LoginPage = class LoginPage {
    constructor(navCtrl, authService, router, translationService, loadingCtrl, toastCtrl, platform) {
        this.navCtrl = navCtrl;
        this.authService = authService;
        this.router = router;
        this.translationService = translationService;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.platform = platform;
        this.isSignIn = true;
        this.showPassword = false;
        this.fullName = '';
        this.phoneNumber = '';
        this.password = '';
        this.email = '';
    }
    ngOnInit() {
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
    toggleView() {
        this.isSignIn = !this.isSignIn;
    }
    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }
    forgotpass() {
        this.router.navigateByUrl('/forgot-password');
    }
    async loginBtn() {
        const loading = await this.loadingCtrl.create({
            message: this.translate('COMMON.LOADING')
        });
        await loading.present();
        try {
            if (this.isSignIn) {
                // Sign In
                const response = await this.authService.login({
                    phoneNumber: this.phoneNumber,
                    password: this.password
                }).toPromise();
                await this.showToast(this.translate('AUTH.LOGIN.SUCCESS'));
                this.router.navigateByUrl('/tabs/tab1');
            }
            else {
                // Sign Up
                const response = await this.authService.signup({
                    fullName: this.fullName,
                    email: this.email,
                    phoneNumber: this.phoneNumber,
                    password: this.password
                }).toPromise();
                await this.showToast(this.translate('AUTH.SIGNUP.SUCCESS'));
                this.router.navigateByUrl('/tabs/tab1');
            }
        }
        catch (error) {
            const errorMessage = error.error?.message || this.translate('COMMON.ERROR');
            await this.showToast(errorMessage);
        }
        finally {
            await loading.dismiss();
        }
    }
    async showToast(message) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 2000,
            position: 'bottom'
        });
        await toast.present();
    }
};
LoginPage = __decorate([
    Component({
        selector: 'app-login',
        templateUrl: './login.page.html',
        styleUrls: ['./login.page.scss'],
        standalone: false
    })
], LoginPage);
export { LoginPage };
//# sourceMappingURL=login.page.js.map