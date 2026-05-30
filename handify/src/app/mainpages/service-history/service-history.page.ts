import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { ApiService } from '../../services/api.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-service-history',
  templateUrl: './service-history.page.html',
  styleUrls: ['./service-history.page.scss'],
  standalone: false
})
export class ServiceHistoryPage implements OnInit {
  activeFilter: string = 'All';
  allBookings: any[] = [];
  filteredHistory: any[] = [];
  loading = false;
  currentLang = 'en';

  constructor(
    public translationService: TranslationService,
    private router: Router,
    private apiService: ApiService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.translationService.currentLang$.subscribe((lang: string) => {
      this.currentLang = lang;
    });
    this.loadHistory();
  }

  ionViewWillEnter() {
    this.loadHistory();
  }

  async loadHistory() {
    this.loading = true;
    this.apiService.getMyBookings().subscribe({
      next: (res: any) => {
        this.allBookings = res.data || [];
        this.filterHistory(this.activeFilter);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching history', err);
        this.loading = false;
      }
    });
  }

  filterHistory(filter: string) {
    this.activeFilter = filter;
    
    if (filter === 'All') {
      this.filteredHistory = [...this.allBookings];
    } else {
      this.filteredHistory = this.allBookings.filter(item =>
        item.status.toLowerCase() === filter.toLowerCase()
      );
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return '#2dd36f';
      case 'cancelled': return '#eb445a';
      case 'pending': return '#ffc409';
      case 'confirmed': return '#3880ff';
      default: return '#92949c';
    }
  }

  viewServiceDetails(service: any) {
    // Navigate to the unified request details page
    this.router.navigate(['/request-details', service._id]);
  }

  closeHistory() {
    this.router.navigate(['/tabs/tab4']); // Usually opened from profile
  }
}
