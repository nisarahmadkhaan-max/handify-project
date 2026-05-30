import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.page.html',
  styleUrls: ['./employee-dashboard.page.scss'],
  standalone: false
})
export class EmployeeDashboardPage implements OnInit {
  employeeName = 'Professional';
  employeeProfession = '';
  isVerified = false;
  walletBalance = 0;
  totalJobs = 0;
  averageRating = 0;
  totalRatings = 0;
  availableFrom = '09:00 AM';
  availableTo = '06:00 PM';

  bookings: any[] = [];
  loadingBookings = false;

  showTimeEditModal = false;
  tempFrom = '';
  tempTo = '';
  pickingFor: 'from' | 'to' = 'from';

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.loadEmployeeData();
    this.loadBookings();
  }

  ionViewWillEnter() {
    this.loadEmployeeData();
    this.loadBookings();
  }

  async loadEmployeeData() {
    const user = this.authService.currentUserValue?.user;
    if (user) {
      this.employeeName = user.fullName;
    }

    this.apiService.getEmployeeProfile().subscribe({
      next: (res: any) => {
        const emp = res.data || res;
        this.isVerified = emp.isVerified;
        this.employeeProfession = emp.service || 'Professional';
        this.walletBalance = emp.walletBalance || 0;
        this.averageRating = emp.averageRating || 0;
        this.totalRatings = emp.totalRatings || 0;

        if (emp.availability && emp.availability.length > 0) {
          this.availableFrom = emp.availability[0].startTime;
          this.availableTo = emp.availability[0].endTime;
        }
      },
      error: (err) => console.error('Error loading employee profile', err)
    });
  }

  loadBookings() {
    this.loadingBookings = true;
    this.apiService.getMyBookings().subscribe({
      next: (res: any) => {
        this.bookings = res.data || [];
        this.totalJobs = this.bookings.filter(b => b.status === 'completed').length;
        this.loadingBookings = false;
      },
      error: (err) => {
        this.loadingBookings = false;
        console.error('Error loading bookings', err);
      }
    });
  }

  viewDetails(bookingId: string) {
    this.router.navigate(['/request-details', bookingId]);
  }

  openWallet() { this.router.navigate(['/wallet-recharge']); }
  switchToUser() { this.router.navigate(['/tabs/tab1']); }

  openSchedule() {
    this.tempFrom = this.availableFrom;
    this.tempTo = this.availableTo;
    this.showTimeEditModal = true;
  }

  onTimeChange(event: any) {
    const time = new Date(event.detail.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    if (this.pickingFor === 'from') this.tempFrom = time;
    else this.tempTo = time;
  }

  async saveSchedule() {
    this.availableFrom = this.tempFrom;
    this.availableTo = this.tempTo;
    this.showTimeEditModal = false;
    const toast = await this.toastController.create({
      message: 'Schedule updated successfully',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
