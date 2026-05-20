import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService, Request } from '../services/request.service';
import { AuthService } from '../services/auth.service';
import { TranslationService } from '../services/translation.service';
import { Subscription } from 'rxjs';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: false
})
export class Tab3Page implements OnInit, OnDestroy {
  activeFilter: string = 'All';
  requests: Request[] = [];
  filteredRequests: Request[] = [];
  loading = false;
  error: string | null = null;
  userRole: string = 'user';
  currentLang = 'en';
  private refreshSubscription: Subscription;

  constructor(
    public router: Router, 
    private requestService: RequestService, 
    private route: ActivatedRoute,
    private authService: AuthService,
    public translationService: TranslationService,
    private toastController: ToastController,
    private alertController: AlertController
  ) { 
    this.refreshSubscription = this.requestService.onRefresh().subscribe(() => {
      this.fetchRequests();
    });
  }

  ngOnInit() {
    this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
    this.checkUserRole();
    this.fetchRequests();
  }

  ionViewWillEnter() {
    this.checkUserRole();
    this.fetchRequests();
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  checkUserRole() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.user) {
      this.userRole = currentUser.user.role || 'user';
    }
  }

  fetchRequests() {
    this.loading = true;
    this.error = null;
    this.requestService.getMyRequests().subscribe({
      next: (res) => {
        // Backend now returns { success: true, data: [] }
        this.requests = res.data || [];
        this.filterRequests(this.activeFilter);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load requests.';
        this.loading = false;
      }
    });
  }

  async acceptJob(request: Request, event: Event) {
    event.stopPropagation(); // Don't open details
    const alert = await this.alertController.create({
      header: 'Confirm Acceptance',
      message: 'Do you want to accept this job request?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Accept',
          handler: () => {
            this.requestService.acceptRequest(request._id).subscribe({
              next: async () => {
                const toast = await this.toastController.create({
                  message: 'Job Accepted! Customer has been notified.',
                  duration: 2000,
                  color: 'success'
                });
                toast.present();
                this.fetchRequests();
              },
              error: async (err) => {
                const toast = await this.toastController.create({
                  message: err.error.error || 'Failed to accept job.',
                  duration: 2000,
                  color: 'danger'
                });
                toast.present();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async rejectJob(request: Request, event: Event) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Ignore Request',
      message: 'Are you sure you want to ignore this request?',
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Yes, Ignore',
          handler: () => {
            // Local UI remove for demo
            this.requests = this.requests.filter(r => r._id !== request._id);
            this.filterRequests(this.activeFilter);
          }
        }
      ]
    });
    await alert.present();
  }

  filterRequests(filter: string) {
    this.activeFilter = filter;
    let base = [...this.requests];

    if (filter !== 'All') {
      base = base.filter(r => r.status.toLowerCase() === filter.toLowerCase());
    }

    this.filteredRequests = base.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  viewRequestDetails(request: Request) {
    this.router.navigateByUrl(`/request-details/${request._id}`);
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmed': return '#2dd36f';
      case 'pending': return '#ffc409';
      case 'cancelled': return '#eb445a';
      case 'completed': return '#3880ff';
      default: return '#92949c';
    }
  }

  getServiceName(request: Request): string {
    return `${request.category} - ${request.service}`;
  }

  getBookingId(request: Request): string {
    return request._id.substring(request._id.length - 6).toUpperCase();
  }

  getDateTime(request: Request): string {
    return `${request.date} | ${request.time}`;
  }

  hasRequests(): boolean { return this.requests.length > 0; }
  hasFilteredRequests(): boolean { return this.filteredRequests.length > 0; }
}
