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
      message: 'Sending OTP...'
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

  async verifyOTP() {
    const otp = this.otpDigits.join('');
    if (otp.length < 4) {
      await this.showToast('Please enter complete OTP');
      return;
    }
    // Moving to password reset step
    this.currentStep = 3;
  }

  async resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      await this.showToast('Passwords do not match');
      return;
    }
    if (this.newPassword.length < 6) {
      await this.showToast('Password must be at least 6 characters');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Resetting Password...' });
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
        message: 'Password reset successfully!',
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
}
