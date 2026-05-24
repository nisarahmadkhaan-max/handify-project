import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { TranslationService } from '../services/translation.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage implements OnInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  
  currentStep = 1;
  phoneNumber = '';
  maskedPhone = '';
  otpDigits: string[] = ['', '', '', ''];
  newPassword = '';
  confirmPassword = '';
  isPhoneValid = false;
  isPasswordValid = false;
  showPassword = false;
  showConfirmPassword = false;
  
  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private translationService: TranslationService,
    private authService: AuthService,
    public router: Router
  ) { }

  ngOnInit() {}

  // Added back missing translate method for HTML template
  translate(key: string, params?: any): string {
    let translation = this.translationService.translate(key);
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }
    return translation;
  }

  validatePhone() {
    // 11 digits validation as requested
    const phoneRegex = /^[0-9]{11}$/;
    this.isPhoneValid = phoneRegex.test(this.phoneNumber);
  }
  
  async requestOTP() {
    if (!this.phoneNumber || this.phoneNumber.length !== 11) {
      await this.showToast('Please insert your number (11 digits required)');
      return;
    }

    const loading = await this.loadingController.create({
      message: this.translate('FORGOT_PASSWORD.SENDING_OTP')
    });
    await loading.present();
    
    try {
      await this.authService.forgotPassword(this.phoneNumber).toPromise();
      this.maskedPhone = this.phoneNumber.substring(0, 4) + ' **** ' + this.phoneNumber.substring(8);
      this.currentStep = 2;
      setTimeout(() => {
        if (this.otpInputs && this.otpInputs.first) {
          this.otpInputs.first.nativeElement.focus();
        }
      }, 300);
      await this.showToast('OTP has been sent to your number');
    } catch (error: any) {
      await this.showToast(error.error?.message || 'Failed to send OTP. Check your number.');
    } finally {
      await loading.dismiss();
    }
  }

  // Added back missing resendOTP method
  async resendOTP() {
    await this.requestOTP();
  }

  // Added back missing isOtpValid method
  isOtpValid(): boolean {
    return this.otpDigits.every(digit => digit !== '');
  }

  async verifyOTP() {
    const otp = this.otpDigits.join('');
    if (otp.length < 4) {
      await this.showToast('Please enter complete OTP');
      return;
    }
    // Moving to password reset step
    this.currentStep = 3;
  }

  // Added back missing validatePassword method
  validatePassword() {
    const isLengthValid = this.newPassword.length >= 8;
    const doPasswordsMatch = this.newPassword === this.confirmPassword;
    this.isPasswordValid = isLengthValid && doPasswordsMatch && this.newPassword !== '';
  }

  async resetPassword() {
    if (!this.isPasswordValid) {
      if (this.newPassword !== this.confirmPassword) {
        await this.showToast('Passwords do not match');
      } else {
        await this.showToast('Password must be at least 8 characters');
      }
      return;
    }

    const loading = await this.loadingController.create({ message: this.translate('FORGOT_PASSWORD.RESETTING_PASSWORD') });
    await loading.present();

    try {
      const otp = this.otpDigits.join('');
      await this.authService.resetPassword({
        phoneNumber: this.phoneNumber,
        otp,
        newPassword: this.newPassword
      }).toPromise();

      const alert = await this.alertController.create({
        header: 'Success',
        message: 'Your password has been reset successfully.',
        buttons: [{ text: 'Login', handler: () => this.router.navigate(['/login']) }]
      });
      await alert.present();
    } catch (error: any) {
      await this.showToast(error.error?.message || 'Invalid OTP or session expired');
    } finally {
      await loading.dismiss();
    }
  }

  onOtpChange(event: any, index: number) {
    const value = event.target.value;
    if (value && index < 3) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') this.showPassword = !this.showPassword;
    else this.showConfirmPassword = !this.showConfirmPassword;
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }

  goBack() {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.router.navigate(['/login']);
    }
  }
}
