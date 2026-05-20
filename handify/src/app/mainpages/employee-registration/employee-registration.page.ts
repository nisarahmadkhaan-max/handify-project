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
  showReviewModal = false;
  tempImage: string = '';

  employeeData: any = {
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    availableFrom: '',
    availableTo: '',
    cnicNumber: '',
    cnicFront: '',
    cnicBack: '',
    selfie: '',
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
      this.currentStep = 2;
    }
  }

  nextStep() { if (this.currentStep < 4) this.currentStep++; }
  prevStep() { if (this.currentStep > 1) this.currentStep--; }

  isStep1Valid() {
    return this.employeeData.username && this.employeeData.email && this.employeeData.phone &&
           this.employeeData.password === this.employeeData.confirmPassword && this.employeeData.password !== '';
  }

  isStep2Valid() {
    return this.employeeData.specialization && this.employeeData.availableFrom && this.employeeData.availableTo;
  }

  isStep3Valid() {
    return this.employeeData.cnicNumber && this.employeeData.cnicNumber.length >= 13 &&
           this.employeeData.cnicFront && this.employeeData.cnicBack && this.employeeData.selfie;
  }

  isStep4Valid() {
    return this.employeeData.emergencyName && this.employeeData.emergencyPhone;
  }

  async uploadFromGallery(field: string) {
    try {
      const image = await Camera.getPhoto({ quality: 90, resultType: CameraResultType.DataUrl, source: CameraSource.Photos });
      if (image && image.dataUrl) {
        this.employeeData[field] = image.dataUrl;
        this.showToast(`${field.replace('cnic', 'CNIC ')} Selected`, 'success');
      }
    } catch (e) { }
  }

  async takeSelfie() {
    try {
      const image = await Camera.getPhoto({ quality: 100, resultType: CameraResultType.DataUrl, source: CameraSource.Camera });
      if (image && image.dataUrl) {
        this.tempImage = image.dataUrl;
        this.showReviewModal = true;
      }
    } catch (e) { }
  }

  confirmPhoto() { this.employeeData.selfie = this.tempImage; this.showReviewModal = false; }
  retakePhoto() { this.showReviewModal = false; this.takeSelfie(); }
  openPicker(t: 'from' | 'to') { this.pickingFor = t; this.showTimePicker = true; }

  onTimeRangeChange(event: any) {
    const time = new Date(event.detail.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    if (this.pickingFor === 'from') this.employeeData.availableFrom = time;
    else this.employeeData.availableTo = time;
  }

  async createAccount() {
    const loading = await this.loadingController.create({
      message: 'Verifying Documents... Our system is reading your CNIC details. Please wait.'
    });
    await loading.present();

    const finalData = { ...this.employeeData, availableTime: `${this.employeeData.availableFrom} to ${this.employeeData.availableTo}` };

    this.apiService.registerEmployee(finalData).subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Registration Successful',
          message: res.message,
          buttons: [{ text: 'Get Started', handler: () => this.router.navigate(['/tabs/tab4']) }]
        });
        await alert.present();
      },
      error: async (err) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Verification Failed',
          message: err.error?.message || 'Automatic verification failed. Please ensure the image is clear and try again.',
          buttons: ['Try Again']
        });
        await alert.present();
      }
    });
  }

  async showToast(m: string, c: string) {
    const t = await this.toastController.create({ message: m, duration: 2000, color: c });
    t.present();
  }

  togglePassword() { this.showPassword = !this.showPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }
}
