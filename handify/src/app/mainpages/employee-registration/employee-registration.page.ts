import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-employee-registration',
  templateUrl: './employee-registration.page.html',
  styleUrls: ['./employee-registration.page.scss'],
  standalone: false
})
export class EmployeeRegistrationPage implements OnInit {
  currentStep = 1;
  showTimePicker = false;
  pickingFor: 'from' | 'to' = 'from';
  showPassword = false;
  showConfirmPassword = false;

  employeeData: any = {
    username: '',
    email: '',
    phone: '',
    profileImage: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    availableFrom: '',
    availableTo: '',
    cnicNumber: '',
    cnicFront: '',
    cnicBack: '',
    emergencyName: '',
    emergencyPhone: ''
  };

  constructor(
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.user) {
      const user = currentUser.user;
      this.employeeData.username = user.fullName || '';
      this.employeeData.email = user.email || '';
      this.employeeData.phone = user.phoneNumber || '';
      this.employeeData.password = 'existing_user';
      this.employeeData.confirmPassword = 'existing_user';
      // If user has existing profile image, you could load it here
      this.currentStep = 1; // Start at step 1 to allow DP upload
    }
  }

  async nextStep() {
    if (this.currentStep === 1) {
      if (!this.employeeData.username || this.employeeData.username.length < 3) {
        await this.showToast('Please enter your full name as per CNIC', 'warning');
        return;
      }
      if (!this.employeeData.email || !this.employeeData.email.toLowerCase().endsWith('@gmail.com')) {
        await this.showToast('Please fill the email (e.g. name@gmail.com)', 'warning');
        return;
      }
      const phoneRegex = /^[0-9]{11}$/;
      if (!this.employeeData.phone || !phoneRegex.test(this.employeeData.phone)) {
        await this.showToast('Please insert your number (11 digits required)', 'warning');
        return;
      }
      if (this.employeeData.password !== this.employeeData.confirmPassword) {
        await this.showToast('Passwords do not match', 'danger');
        return;
      }
    }

    if (this.currentStep < 4) this.currentStep++;
  }

  prevStep() { if (this.currentStep > 1) this.currentStep--; }

  isStep1Valid() {
    return this.employeeData.username && this.employeeData.email && this.employeeData.phone &&
           this.employeeData.password && this.employeeData.confirmPassword;
  }

  isStep2Valid() {
    return this.employeeData.specialization && this.employeeData.availableFrom && this.employeeData.availableTo;
  }

  isStep3Valid() {
    // Selfie check removed, only CNIC number and Front/Back photos required
    return this.employeeData.cnicNumber && this.employeeData.cnicNumber.toString().length >= 13 &&
           this.employeeData.cnicFront && this.employeeData.cnicBack;
  }

  isStep4Valid() {
    return this.employeeData.emergencyName && this.employeeData.emergencyPhone;
  }

  async uploadFromGallery(field: string) {
    try {
      const image = await Camera.getPhoto({ quality: 90, resultType: CameraResultType.DataUrl, source: CameraSource.Photos });
      if (image && image.dataUrl) {
        this.employeeData[field] = image.dataUrl;
        this.showToast(`${field === 'cnicFront' ? 'CNIC Front' : 'CNIC Back'} Selected`, 'success');
      }
    } catch (e) { }
  }

  openPicker(t: 'from' | 'to') { this.pickingFor = t; this.showTimePicker = true; }

  onTimeRangeChange(event: any) {
    const time = new Date(event.detail.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    if (this.pickingFor === 'from') this.employeeData.availableFrom = time;
    else this.employeeData.availableTo = time;
  }

  async createAccount() {
    const phoneRegex = /^[0-9]{11}$/;
    if (!this.employeeData.emergencyPhone || !phoneRegex.test(this.employeeData.emergencyPhone)) {
      await this.showToast('Please insert a valid 11-digit emergency contact number', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Verifying Name & CNIC... Please wait.'
    });
    await loading.present();

    this.apiService.registerEmployee(this.employeeData).subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Verification Successful',
          message: res.message,
          buttons: [{ text: 'Get Started', handler: () => this.router.navigate(['/tabs/tab4']) }]
        });
        await alert.present();
      },
      error: async (err) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Verification Failed',
          message: err.error?.message || 'Automatic verification failed. Please ensure the CNIC front photo is clear and name matches.',
          buttons: ['Try Again']
        });
        await alert.present();
      }
    });
  }

  async showToast(m: string, c: string = 'dark') {
    const t = await this.toastController.create({ message: m, duration: 2500, color: c, position: 'bottom' });
    t.present();
  }

  togglePassword() { this.showPassword = !this.showPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }
}
