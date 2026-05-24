import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  isSignIn: boolean = true;
  showPassword: boolean = false;
  fullName: string = '';
  phoneNumber: string = '';
  password: string = '';
  email: string = '';

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private router: Router,
    private translationService: TranslationService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private platform: Platform
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.platform.backButton.subscribeWithPriority(100, () => {
    });
  }

  ionViewWillLeave() {
    this.platform.backButton.unsubscribe();
  }

  translate(key: string): string {
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
    const phoneRegex = /^[0-9]{11}$/;

    if (this.isSignIn) {
      // Sign In Validation - Now using Email
      if (!this.email || !this.email.toLowerCase().endsWith('@gmail.com')) {
        await this.showToast('Please fill the email (must be @gmail.com)');
        return;
      }
      if (!this.password) {
        await this.showToast('Please enter your password');
        return;
      }
    } else {
      // Sign Up Validation
      if (!this.fullName) {
        await this.showToast('Please enter your full name');
        return;
      }
      // Email Check
      if (!this.email || !this.email.toLowerCase().endsWith('@gmail.com')) {
        await this.showToast('Please fill the email (must be @gmail.com)');
        return;
      }
      // Phone Check (Still kept for record as requested earlier)
      if (!this.phoneNumber || !phoneRegex.test(this.phoneNumber)) {
        await this.showToast('Please insert your number (11 digits required)');
        return;
      }
      if (!this.password) {
        await this.showToast('Please fill all fields');
        return;
      }
    }

    const loading = await this.loadingCtrl.create({
      message: this.translate('COMMON.LOADING')
    });
    await loading.present();

    try {
      if (this.isSignIn) {
        // Sign In with Email
        const response1 = await this.authService.login({
          email: this.email,
          password: this.password
        }).toPromise();
        await this.showToast(response1.message);
        this.router.navigateByUrl('/tabs/tab1');
      } else {
        // Sign Up with both
        const response = await this.authService.signup({
          fullName: this.fullName,
          email: this.email,
          phoneNumber: this.phoneNumber,
          password: this.password
        }).toPromise();
        await this.showToast(response.message);
        this.router.navigateByUrl('/tabs/tab1');
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error?.error?.message || this.translate('COMMON.ERROR');

      if (error.status === 403 || errorMessage.toLowerCase().includes('verify')) {
        await this.showToast('Please verify your self');
      } else {
        await this.showToast(errorMessage);
      }
    } finally {
      await loading.dismiss();
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }
}
