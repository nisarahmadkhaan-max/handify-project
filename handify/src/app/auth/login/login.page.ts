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
    // Disable back button
    this.platform.backButton.subscribeWithPriority(100, () => {
      // Do nothing - effectively disabling the back button
    });
  }

  ionViewWillLeave() {
    // Re-enable back button when leaving the page
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
    const loading = await this.loadingCtrl.create({
      message: this.translate('COMMON.LOADING')
    });
    await loading.present();

    try {
      if (this.isSignIn) {
        // Sign In
        const response1 = await this.authService.login({
          phoneNumber: this.phoneNumber,
          password: this.password
        }).toPromise();
        console.log(response1);
        await this.showToast(response1.message);
        this.router.navigateByUrl('/tabs/tab1');
      } else {
        // Sign Up
        const response = await this.authService.signup({
          fullName: this.fullName,
          email: this.email,
          phoneNumber: this.phoneNumber,
          password: this.password
        }).toPromise();
        console.log(response);
        await this.showToast(response.message);
        this.router.navigateByUrl('/tabs/tab1');
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error?.error?.message || this.translate('COMMON.ERROR');
      await this.showToast(errorMessage);
    } finally {
      await loading.dismiss();
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
