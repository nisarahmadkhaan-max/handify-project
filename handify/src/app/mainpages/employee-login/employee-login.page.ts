import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-login',
  templateUrl: './employee-login.page.html',
  styleUrls: ['./employee-login.page.scss'],
  standalone: false
})
export class EmployeeLoginPage implements OnInit {
  loginData = {
    email: '',
    password: ''
  };
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() { }

  async login() {
    // Email Validation (@gmail.com check)
    if (!this.loginData.email || !this.loginData.email.toLowerCase().endsWith('@gmail.com')) {
      await this.showToast('Please fill the email (must be @gmail.com)', 'warning');
      return;
    }

    if (!this.loginData.password) {
      await this.showToast('Please enter your password', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Authenticating...' });
    await loading.present();

    // Now sending 'email' instead of 'phoneNumber' to match AuthService type
    this.authService.login({
      email: this.loginData.email,
      password: this.loginData.password
    }).subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.router.navigate(['/employee-dashboard']);
        this.showToast('Logged in as Employee', 'success');
      },
      error: async (err) => {
        await loading.dismiss();

        let errorMessage = err.error?.message || 'Login failed';

        // Handling the "Please verify your self" error from backend
        if (err.status === 403 || errorMessage.toLowerCase().includes('verify')) {
          await this.showToast('Please verify your self', 'danger');
        } else {
          await this.showToast(errorMessage, 'danger');
        }
      }
    });
  }

  goToSignup() {
    this.router.navigate(['/employee-registration']);
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}
