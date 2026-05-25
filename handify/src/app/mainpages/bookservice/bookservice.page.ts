import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bookservice',
  templateUrl: './bookservice.page.html',
  styleUrls: ['./bookservice.page.scss'],
  standalone: false
})
export class BookservicePage implements OnInit {
  bookingData = {
    category: '',
    service: '',
    basePrice: 0,
    date: '',
    time: '',
    location: '',
    additionalInstructions: ''
  };

  finalPrice: number = 0;
  selectedService: any = null;
  selectedDate: string = '';
  selectedTime: string = '';
  showDatePicker = false;
  showTimePicker = false;

  commissions = { low: 5, mid: 10, high: 15 };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private authService: AuthService,
    private apiService: ApiService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private http: HttpClient,
    public translationService: TranslationService
  ) { }

  ngOnInit() {
    this.loadCommissions();

    // Auto-fill location from user profile if available
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.user && currentUser.user.location) {
      this.bookingData.location = currentUser.user.location;
    } else {
      // If profile location is not set, try to fetch it now quietly
      this.getQuietLocation();
    }

    this.route.queryParams.subscribe(params => {
      if (params['service']) {
        this.selectedService = JSON.parse(params['service']);
        this.bookingData.service = this.selectedService.name || this.selectedService._id;
        this.bookingData.category = this.selectedService.category || 'General';
        this.bookingData.basePrice = this.selectedService.price || 0;
        this.calculateFinalPriceDisplay();
      }
    });
  }

  // Quietly fetch location without showing a big loading spinner
  async getQuietLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
      this.http.get(url).subscribe((res: any) => {
        if (!this.bookingData.location) {
          this.bookingData.location = res?.display_name || `${lat}, ${lng}`;
        }
      });
    } catch (e) {}
  }

  // When user clicks the address box, if it's empty, suggest current location
  async onLocationClick() {
    if (!this.bookingData.location) {
      await this.getCurrentLocation();
    }
  }

  loadCommissions() {
    this.apiService.getSetting('commission_low').subscribe({ next: (res: any) => { this.commissions.low = parseFloat(res.data); this.calculateFinalPriceDisplay(); } });
    this.apiService.getSetting('commission_mid').subscribe({ next: (res: any) => { this.commissions.mid = parseFloat(res.data); this.calculateFinalPriceDisplay(); } });
    this.apiService.getSetting('commission_high').subscribe({ next: (res: any) => { this.commissions.high = parseFloat(res.data); this.calculateFinalPriceDisplay(); } });
  }

  calculateFinalPriceDisplay() {
    const base = this.bookingData.basePrice;
    if (!base) return;
    let percentage = base <= 500 ? this.commissions.low / 100 : (base <= 800 ? this.commissions.mid / 100 : this.commissions.high / 100);
    this.finalPrice = Math.round(base + (base * percentage));
  }

  openDatePicker() { this.showDatePicker = true; }
  openTimePicker() { this.showTimePicker = true; }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    this.bookingData.date = new Date(this.selectedDate).toLocaleDateString();
  }

  onTimeChange(event: any) {
    const timeValue = event.detail.value;
    this.selectedTime = timeValue;
    this.bookingData.time = new Date(timeValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  async getCurrentLocation() {
    const loading = await this.loadingController.create({ message: 'Fetching location...' });
    await loading.present();
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
      this.http.get(url).subscribe((res: any) => {
        loading.dismiss();
        this.bookingData.location = res?.display_name || `${lat}, ${lng}`;
        this.showToast('Location updated!', 'success');
      }, () => {
        loading.dismiss();
        this.bookingData.location = `${lat}, ${lng}`;
      });
    } catch (error) {
      loading.dismiss();
      this.showToast('GPS Error', 'danger');
    }
  }

  async confirmBooking() {
    if (!this.bookingData.date || !this.bookingData.time || !this.bookingData.location) {
      this.showToast('Please fill all required fields.', 'warning');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Booking your service...' });
    await loading.present();

    this.bookingService.createBooking(this.bookingData).subscribe({
      next: async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Your booking has been placed successfully!',
          buttons: [{ text: 'OK', handler: () => { this.router.navigate(['/tabs/tab3']); } }]
        });
        await alert.present();
      },
      error: async (err) => {
        await loading.dismiss();
        this.showToast(err.error?.message || 'Booking failed', 'danger');
      }
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({ message, duration: 2000, color });
    toast.present();
  }
}
