import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bookingconfirm',
  templateUrl: './bookingconfirm.page.html',
  styleUrls: ['./bookingconfirm.page.scss'],
  standalone: false
})
export class BookingconfirmPage implements OnInit {
  bookingDetails: any = {
    category: '',
    service: '',
    estimatedCost: 0,
    date: '',
    time: '',
    location: '',
    additionalInstructions: '',
    status: '',
    _id: '',
    createdAt: '',
    updatedAt: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get booking data from route params
    this.route.queryParams.subscribe(params => {
      if (params['bookingData']) {
        try {
          this.bookingDetails = JSON.parse(params['bookingData']);
          console.log('Booking Details:', this.bookingDetails);
        } catch (error) {
          console.error('Error parsing booking data:', error);
        }
      } else {
        console.error('No booking data found in route params');
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
    try {
      const time = new Date(timeString);
      return time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  }

  closeConfirmation() {
    this.router.navigate(["/tabs/tab1"]);
  }

  gobackhome() {
    this.router.navigate(["/tabs/tab2"]);
  }
}

