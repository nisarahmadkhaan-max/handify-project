import { __decorate } from "tslib";
import { Component, ViewChildren } from '@angular/core';
let ForgotPasswordPage = class ForgotPasswordPage {
    constructor(alertController, loadingController, toastController, translationService, authService, router) {
        this.alertController = alertController;
        this.loadingController = loadingController;
        this.toastController = toastController;
        this.translationService = translationService;
        this.authService = authService;
        this.router = router;
        this.currentStep = 1;
        this.phoneNumber = '';
        this.maskedPhone = '';
        this.otpDigits = ['', '', '', ''];
        this.newPassword = '';
        this.confirmPassword = '';
        this.isPhoneValid = false;
        this.isPasswordValid = false;
        this.showPassword = false;
        this.showConfirmPassword = false;
    }
    ngOnInit() {
    }
    translate(key, params) {
        let translation = this.translationService.translate(key);
        if (params) {
            Object.keys(params).forEach(param => {
                translation = translation.replace(`{${param}}`, params[param]);
            });
        }
        return translation;
    }
    // Navigation methods
    goBack() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }
    // Step 1: Phone validation
    validatePhone() {
        this.isPhoneValid = Boolean(this.phoneNumber && this.phoneNumber.replace(/\D/g, '').length >= 10);
    }
    async requestOTP() {
        const loading = await this.loadingController.create({
            message: this.translate('FORGOT_PASSWORD.SENDING_OTP')
        });
        await loading.present();
        try {
            await this.authService.forgotPassword(this.phoneNumber).toPromise();
            // Mask the phone number for display
            const digits = this.phoneNumber.replace(/\D/g, '');
            this.maskedPhone = '+' + digits.substring(0, 2) + ' ' +
                digits.substring(2, 5) + ' ' +
                digits.substring(5, 8) + digits.substring(8);
            // Move to OTP verification step
            this.currentStep = 2;
            // Focus on first OTP input after a short delay
            setTimeout(() => {
                this.otpInputs.first.nativeElement.focus();
            }, 300);
            await this.showToast(this.translate('FORGOT_PASSWORD.OTP_SENT'));
        }
        catch (error) {
            await this.showToast(error.error?.message || this.translate('COMMON.ERROR'));
        }
        finally {
            await loading.dismiss();
        }
    }
    // Step 2: OTP verification
    onOtpChange(event, index) {
        const value = event.target.value;
        // Auto-move to next input
        if (value && index < 3) {
            setTimeout(() => {
                this.otpInputs.toArray()[index + 1].nativeElement.focus();
            }, 10);
        }
        // Allow backspace to go to previous input
        if (value === '' && index > 0) {
            setTimeout(() => {
                this.otpInputs.toArray()[index - 1].nativeElement.focus();
            }, 10);
        }
    }
    isOtpValid() {
        return this.otpDigits.every(digit => digit !== '');
    }
    async resendOTP() {
        const loading = await this.loadingController.create({
            message: this.translate('FORGOT_PASSWORD.SENDING_OTP')
        });
        await loading.present();
        try {
            await this.authService.forgotPassword(this.phoneNumber).toPromise();
            await this.showToast(this.translate('FORGOT_PASSWORD.OTP_RESENT'));
        }
        catch (error) {
            await this.showToast(error.error?.message || this.translate('COMMON.ERROR'));
        }
        finally {
            await loading.dismiss();
        }
    }
    async verifyOTP() {
        const loading = await this.loadingController.create({
            message: this.translate('FORGOT_PASSWORD.VERIFYING_OTP')
        });
        await loading.present();
        try {
            // Move to password reset step
            this.currentStep = 3;
        }
        catch (error) {
            await this.showToast(error.error?.message || this.translate('COMMON.ERROR'));
        }
        finally {
            await loading.dismiss();
        }
    }
    // Step 3: Password reset
    validatePassword() {
        // Password must be at least 8 characters and match confirmation
        const isLengthValid = this.newPassword.length >= 8;
        const doPasswordsMatch = this.newPassword === this.confirmPassword;
        this.isPasswordValid = isLengthValid && doPasswordsMatch && this.newPassword !== '';
    }
    togglePasswordVisibility(field) {
        if (field === 'password') {
            this.showPassword = !this.showPassword;
        }
        else {
            this.showConfirmPassword = !this.showConfirmPassword;
        }
    }
    async resetPassword() {
        const loading = await this.loadingController.create({
            message: this.translate('FORGOT_PASSWORD.RESETTING_PASSWORD')
        });
        await loading.present();
        try {
            const otp = this.otpDigits.join('');
            await this.authService.resetPassword({
                phoneNumber: this.phoneNumber,
                otp,
                newPassword: this.newPassword
            }).toPromise();
            const alert = await this.alertController.create({
                header: this.translate('FORGOT_PASSWORD.SUCCESS'),
                message: this.translate('FORGOT_PASSWORD.PASSWORD_RESET_SUCCESS'),
                buttons: [
                    {
                        text: this.translate('FORGOT_PASSWORD.LOGIN'),
                        handler: () => {
                            this.router.navigateByUrl('/login');
                        }
                    }
                ]
            });
            await alert.present();
        }
        catch (error) {
            await this.showToast(error.error?.message || this.translate('COMMON.ERROR'));
        }
        finally {
            await loading.dismiss();
        }
    }
    async showToast(message) {
        const toast = await this.toastController.create({
            message,
            duration: 2000,
            position: 'bottom'
        });
        await toast.present();
    }
};
__decorate([
    ViewChildren('otpInput')
], ForgotPasswordPage.prototype, "otpInputs", void 0);
ForgotPasswordPage = __decorate([
    Component({
        selector: 'app-forgot-password',
        templateUrl: './forgot-password.page.html',
        styleUrls: ['./forgot-password.page.scss'],
        standalone: false
    })
], ForgotPasswordPage);
export { ForgotPasswordPage };
//# sourceMappingURL=forgot-password.page.js.map