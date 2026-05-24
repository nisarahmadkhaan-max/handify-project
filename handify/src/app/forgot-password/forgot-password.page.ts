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
  email = '';
  otpDigits: string[] = ['', '', '', ''];
  newPassword = '';
  confirmPassword = '';
  isEmailValid = false;
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

  translate(key: string, params?: any): string {
    let translation = this.translationService.translate(key);
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }
    return translation;
  }

  validateEmail() {
    // Email must end with @gmail.com as requested
    this.isEmailValid = this.email.toLowerCase().endsWith('@gmail.com');
  }
  
  async requestOTP() {
    if (!this.isEmailValid) {
      await this.showToast('Please fill the email (must be @gmail.com)');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Sending OTP to your email...'
    });
    await loading.present();
    
    try {
      await this.authService.forgotPassword(this.email).toPromise();
      this.currentStep = 2;
      setTimeout(() => {
        if (this.otpInputs && this.otpInputs.first) {
          this.otpInputs.first.nativeElement.focus();
        }
      }, 300);
      await this.showToast('OTP has been sent to your email');
    } catch (error: any) {
      await this.showToast(error.error?.message || 'Error sending OTP. Make sure your email is registered.');
    } finally {
      await loading.dismiss();
    }
  }

  async resendOTP() {
    await this.requestOTP();
  }

  isOtpValid(): boolean {
    return this.otpDigits.every(digit => digit !== '');
  }

  async verifyOTP() {
    const otp = this.otpDigits.join('');
    if (otp.length < 4) {
      await this.showToast('Please enter 4-digit OTP');
      return;
    }
    this.currentStep = 3;
  }

  validatePassword() {
    const isLengthValid = this.newPassword.length >= 6;
    const doPasswordsMatch = this.newPassword === this.confirmPassword;
    this.isPasswordValid = isLengthValid && doPasswordsMatch && this.newPassword !== '';
  }

  async resetPassword() {
    if (!this.isPasswordValid) {
      if (this.newPassword !== this.confirmPassword) {
        await this.showToast('Passwords do not match');
      } else {
        await this.showToast('Password must be at least 6 characters');
      }
      return;
    }

    const loading = await this.loadingController.create({ message: 'Resetting Password...' });
    await loading.present();

    try {
      const otp = this.otpDigits.join('');
      await this.authService.resetPassword({
        email: this.email,
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
