import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  isSearchingLocation = false;
  locationSuggestions: any[] = [];
  private searchSubject = new Subject<string>();

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
  ) {
    // Set up debounced search for location suggestions
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.fetchSuggestions(searchTerm);
    });
  }

  ngOnInit() {
    this.loadCommissions();

    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.user && currentUser.user.location) {
      this.bookingData.location = currentUser.user.location;
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

  onLocationInput(event: any) {
    const val = event.target.value;
    if (val && val.length > 2) {
      this.searchSubject.next(val);
    } else {
      this.locationSuggestions = [];
    }
  }

  fetchSuggestions(searchTerm: string) {
    this.isSearchingLocation = true;
    // Limit search to Karachi/Pakistan area for better relevance if needed, or keep it general
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&addressdetails=1&limit=5&countrycodes=pk`;

    this.http.get(url).subscribe((res: any) => {
      this.isSearchingLocation = false;
      this.locationSuggestions = res;
    }, () => {
      this.isSearchingLocation = false;
    });
  }

  selectLocation(suggestion: any) {
    const addr = suggestion.address;
    const cleanAddress = [
      suggestion.name || '',
      addr.road || '',
      addr.suburb || addr.neighbourhood || '',
      addr.city || addr.town || addr.village || '',
    ].filter((val, index, self) => val && self.indexOf(val) === index).join(', ');

    this.bookingData.location = cleanAddress || suggestion.display_name;
    this.locationSuggestions = [];
  }

  // Improved Current Location Logic with High Accuracy
  async getCurrentLocation() {
    const loading = await this.loadingController.create({
      message: 'Fetching Exact Location...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // Added enableHighAccuracy for better GPS precision
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;

      // zoom=18 for more specific details (house level)
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

      this.http.get(url).subscribe((res: any) => {
        loading.dismiss();
        if (res && res.address) {
          const addr = res.address;
          // Priority building name or house number for exactness
          const cleanAddress = [
            addr.building || addr.house_number || '',
            addr.road || '',
            addr.suburb || addr.neighbourhood || '',
            addr.city || addr.town || addr.village || '',
          ].filter(val => !!val).join(', ');

          this.bookingData.location = cleanAddress || res.display_name;
          this.showToast('Exact Location Found!', 'success');
        } else {
          this.bookingData.location = `Near ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        }
      }, () => {
        loading.dismiss();
        this.showToast('Could not fetch address details', 'warning');
      });
    } catch (error) {
      loading.dismiss();
      this.showToast('Please enable GPS & Permissions', 'danger');
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
    const toast = await this.toastController.create({ message, duration: 2500, color });
    toast.present();
  }
}
