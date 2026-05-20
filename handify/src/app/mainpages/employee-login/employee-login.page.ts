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
    if (!this.loginData.phone || !this.loginData.password) {
      this.showToast('Please enter both phone and password', 'warning');
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

        // Employee dashboard par bhej rahe hain
        this.router.navigate(['/employee-dashboard']);
        this.showToast('Logged in as Employee', 'success');
      },
      error: async (err) => {
        await loading.dismiss();
        this.showToast(err.error?.message || 'Login failed', 'danger');
      }
    });
  }

  goToSignup() {
    this.router.navigate(['/employee-registration']);
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color });
    toast.present();
  }
}
