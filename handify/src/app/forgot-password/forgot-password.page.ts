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
    public router: Router // Changed from private to public
  ) { }

  ngOnInit() {
  }

  translate(key: string, params?: any): string {
    let translation = this.translationService.translate(key);
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }
    return translation;
  }
  
  goBack() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
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
      const digits = this.phoneNumber.replace(/\D/g, '');
      this.maskedPhone = '+' + digits.substring(0, 2) + ' ' + 
                         digits.substring(2, 5) + ' ' + 
                         digits.substring(5, 8) + digits.substring(8);
      this.currentStep = 2;
      setTimeout(() => {
        this.otpInputs.first.nativeElement.focus();
      }, 300);
      await this.showToast(this.translate('FORGOT_PASSWORD.OTP_SENT'));
    } catch (error: any) {
      await this.showToast(error.error?.message || this.translate('COMMON.ERROR'));
    } finally {
      await loading.dismiss();
    }
  }
  
  onOtpChange(event: any, index: number) {
    const value = event.target.value;
    if (value && index < 3) {
      setTimeout(() => {
        this.otpInputs.toArray()[index + 1].nativeElement.focus();
      }, 10);
    }
    if (value === '' && index > 0) {
      setTimeout(() => {
        this.otpInputs.toArray()[index - 1].nativeElement.focus();
      }, 10);
    }
  }
  
  isOtpValid(): boolean {
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
    } catch (error: any) {
      await this.showToast(error.error?.message || this.translate('COMMON.ERROR'));
    } finally {
      await loading.dismiss();
    }
  }
  
  async verifyOTP() {
    const loading = await this.loadingController.create({
      message: this.translate('FORGOT_PASSWORD.VERIFYING_OTP')
    });
    await loading.present();
    try {
      this.currentStep = 3;
    } catch (error: any) {
      await this.showToast(error.error?.message || this.translate('COMMON.ERROR'));
    } finally {
      await loading.dismiss();
    }
  }
  
  validatePassword() {
    const isLengthValid = this.newPassword.length >= 8;
    const doPasswordsMatch = this.newPassword === this.confirmPassword;
    this.isPasswordValid = isLengthValid && doPasswordsMatch && this.newPassword !== '';
  }
  
  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
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
    } catch (error: any) {
      await this.showToast(error.error?.message || this.translate('COMMON.ERROR'));
    } finally {
      await loading.dismiss();
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}