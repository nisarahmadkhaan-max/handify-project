import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

interface ServiceHistoryItem {
  id: string;
  serviceName: string;
  status: 'Completed' | 'Cancelled' | 'Pending';
  dateTime: string;
  bookingId: string;
  rating?: number; // Optional since cancelled services don't have ratings
}

@Component({
  selector: 'app-service-history',
  templateUrl: './service-history.page.html',
  styleUrls: ['./service-history.page.scss'],
  standalone: false
})
export class ServiceHistoryPage implements OnInit {
  activeFilter: string = 'All';
  serviceHistory: ServiceHistoryItem[] = [
    {
      id: '1',
      serviceName: 'AC Repair',
      status: 'Completed',
      dateTime: 'May 10, 2:00 PM',
      bookingId: '#AC789',
      rating: 4.5
    },
    {
      id: '2',
      serviceName: 'Dry Cleaning',
      status: 'Completed',
      dateTime: 'May 8, 10:00 AM',
      bookingId: '#DC456',
      rating: 4
    },
    {
      id: '3',
      serviceName: 'Plumbing Service',
      status: 'Cancelled',
      dateTime: 'May 12, 1:00 PM',
      bookingId: '#PL123'
    }
  ];
  
  filteredHistory: ServiceHistoryItem[] = [];
  currentLang = 'en';

  constructor(public translationService: TranslationService, private router: Router) { }

  ngOnInit() {
    this.translationService.currentLang$.subscribe((lang: string) => {
      this.currentLang = lang;
    });
    this.filterHistory('All');
  }

  filterHistory(filter: string) {
    this.activeFilter = filter;
    
    if (filter === 'All') {
      this.filteredHistory = [...this.serviceHistory];
    } else {
      this.filteredHistory = this.serviceHistory.filter(item => 
        item.status === filter
      );
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Completed':
        return 'blue';
      case 'Cancelled':
        return 'red';
      case 'Pending':
        return 'gold';
      default:
        return 'gray';
    }
  }

  getRatingStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    const stars = [];
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }
    
    // Add half star if needed
    if (halfStar) {
      stars.push('star-half');
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push('star-outline');
    }
    
    return stars;
  }

  viewServiceDetails(service: ServiceHistoryItem) {
    // Navigate to service details page
    this.router.navigate(['/service-details', service.id]);
  }

  closeHistory() {
    this.router.navigate(['/home']);
  }

  openSearch() {
    // Implement search functionality
    alert('Search functionality would open here');
  }

  switchLanguage(lang: string) {
    this.translationService.setLanguage(lang);
  }
}