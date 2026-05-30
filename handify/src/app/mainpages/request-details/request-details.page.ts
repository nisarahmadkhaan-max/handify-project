import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.page.html',
  styleUrls: ['./request-details.page.scss'],
  standalone: false
})
export class RequestDetailsPage implements OnInit {
  requestId: string = '';
  booking: any;
  loading = false;
  userRole = '';
  currentLang = 'en';

  // Rating properties
  userRating: number = 0;
  userReview: string = '';
  completionSummary: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    public translationService: TranslationService,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.translationService.currentLang$.subscribe(lang => this.currentLang = lang);
    this.userRole = this.authService.currentUserValue?.user?.role;
    this.requestId = this.route.snapshot.paramMap.get('id') || '';
    if (this.requestId) {
      this.loadBookingDetails();
    }
  }

  loadBookingDetails() {
    this.loading = true;
    this.apiService.getBooking(this.requestId).subscribe({
      next: (res: any) => {
        this.booking = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showToast('Failed to load details', 'danger');
      }
    });
  }

  setRating(star: number) {
    this.userRating = star;
  }

  async submitRating() {
    const loading = await this.loadingController.create({ message: 'Submitting feedback...' });
    await loading.present();

    this.apiService.rateBooking(this.requestId, this.userRating, this.userReview).subscribe({
      next: (res) => {
        loading.dismiss();
        this.showToast(res.message, 'success');
        this.loadBookingDetails(); // Refresh to show the rating display
      },
      error: (err) => {
        loading.dismiss();
        this.showToast(err.error?.message || 'Error submitting rating', 'danger');
      }
    });
  }

  async acceptJob() {
    const loading = await this.loadingController.create({ message: 'Accepting...' });
    await loading.present();

    this.apiService.acceptBooking(this.requestId).subscribe({
      next: () => {
        loading.dismiss();
        this.showToast('Job accepted successfully!', 'success');
        this.loadBookingDetails();
      },
      error: async (err) => {
        await loading.dismiss();
        if (err.error_code === 'INSUFFICIENT_WALLET') {
          this.showInsufficientBalanceAlert();
        } else {
          this.showToast(err.error?.message || 'Error accepting job', 'danger');
        }
      }
    });
  }

  async startWork() {
    const loading = await this.loadingController.create({ message: 'Starting timer...' });
    await loading.present();

    this.apiService.startWork(this.requestId).subscribe({
      next: (res) => {
        loading.dismiss();
        this.showToast('Work started! Hourly billing is active.', 'success');
        this.loadBookingDetails();
      },
      error: (err) => {
        loading.dismiss();
        this.showToast(err.error?.message || 'Error starting work', 'danger');
      }
    });
  }

  async showInsufficientBalanceAlert() {
    const alert = await this.alertController.create({
      header: 'Insufficient Balance',
      message: 'Please recharge your wallet to accept this job.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Recharge', handler: () => this.router.navigate(['/wallet-recharge']) }
      ]
    });
    await alert.present();
  }

  goToChat() {
    if (this.booking) {
      this.router.navigate(['/live-chat'], {
        queryParams: {
          bookingId: this.requestId,
          receiverId: this.userRole === 'employee' ? this.booking.userId?._id : this.booking.employeeId?.userId?._id,
          receiverName: this.userRole === 'employee' ? this.booking.userId?.fullName : this.booking.employeeId?.name
        }
      });
    }
  }

  async finishJob() {
    const alert = await this.alertController.create({
      header: 'Finish Job',
      message: 'Enter the 4-digit OTP provided by the customer:',
      inputs: [{ name: 'otp', type: 'number', placeholder: 'XXXX' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Submit', handler: (data) => this.submitCompletion(data.otp) }
      ]
    });
    await alert.present();
  }

  async submitCompletion(otp: string) {
    const loading = await this.loadingController.create();
    await loading.present();
    this.apiService.completeBooking(this.requestId, otp).subscribe({
      next: (res) => {
        loading.dismiss();
        this.showToast(res.message, 'success');
        if (res.summary) {
          this.completionSummary = res.summary;
        }
        this.loadBookingDetails();
      },
      error: (err) => {
        loading.dismiss();
        this.showToast(err.error?.message || 'Invalid OTP', 'danger');
      }
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({ message, duration: 2000, color });
    toast.present();
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'in_progress': return 'tertiary';
      case 'completed': return 'primary';
      case 'cancelled': return 'danger';
      default: return 'medium';
    }
  }

  closeDetails() {
    if (this.userRole === 'employee') this.router.navigate(['/employee-dashboard']);
    else this.router.navigate(['/tabs/tab3']);
  }
}
