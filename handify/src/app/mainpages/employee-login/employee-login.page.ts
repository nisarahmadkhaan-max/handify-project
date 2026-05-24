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
    phone: '',
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
    const phoneRegex = /^[0-9]{11}$/;

    if (!this.loginData.phone || !phoneRegex.test(this.loginData.phone)) {
      this.showToast('Please insert your valid 11-digit number', 'warning');
      return;
    }

    if (!this.loginData.password) {
      this.showToast('Please enter your password', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Authenticating...' });
    await loading.present();

    this.authService.login({
      phoneNumber: this.loginData.phone,
      password: this.loginData.password
    }).subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.router.navigate(['/employee-dashboard']);
        this.showToast('Logged in as Employee', 'success');
      },
      error: async (err) => {
        await loading.dismiss();

        // Handling the Verification error specifically
        let errorMessage = err.error?.message || 'Login failed';

        if (err.status === 403 || errorMessage.includes('verify')) {
          await this.showToast('Please verify your self', 'danger'); // Exact wording as requested
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
