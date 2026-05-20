import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  bookService() {
    console.log('Book a service clicked');
    // Add your navigation or modal logic here
  }

  viewHistory() {
    console.log('View history clicked');
    // Add your navigation logic here
  }

  bookingDetails() {
    console.log('Booking details clicked');
    // Add your navigation logic here
  }

  contactSupport() {
    console.log('Contact support clicked');
    // Add your navigation or modal logic here
  }

  bookNow() {
    console.log('Book now clicked');
    // Add your booking flow logic here
  }
}