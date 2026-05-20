import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../services/translation.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: false
})
export class Tab1Page implements OnInit {
  categories: Category[] = [];
  currentLang = 'en';
  userName: string = '';
  greeting: string = '';

  constructor(
    private router: Router,
    public translationService: TranslationService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.setGreeting(); // Update greeting when language changes
    });
    this.loadFeaturedCategories();
    // Get user name from AuthService/localStorage
    const userData = this.authService.currentUserValue?.user;
    this.userName = userData?.fullName || '';
    this.setGreeting();
  }

  setGreeting() {
    const hour = new Date().getHours();
    let greetingKey = '';

    if (hour >= 5 && hour < 12) {
      greetingKey = 'goodMorning';
    } else if (hour >= 12 && hour < 17) {
      greetingKey = 'goodAfternoon';
    } else if (hour >= 17 && hour < 21) {
      greetingKey = 'goodEvening';
    } else {
      greetingKey = 'goodNight';
    }

    this.greeting = this.translationService.getTranslation(greetingKey);
  }

  loadFeaturedCategories() {
    this.categoryService.getFeaturedCategories(3).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading featured categories:', error);
      }
    });
  }

  switchLanguage(lang: string) {
    this.translationService.setLanguage(lang);
  }

  bookService() {
    console.log('Book a service clicked');
    this.router.navigate(['/tabs/tab2']);
  }

  viewHistory() {
    console.log('View history clicked');
    this.router.navigate(['/service-history']);
  }

  bookingDetails() {
    console.log('Booking details clicked');
    this.router.navigate(['/tabs/tab3']);
  }

  contactSupport() {
    console.log('Contact support clicked');
    this.router.navigate(['/contact-support']);
  }

  bookNow() {
    console.log('Book now clicked');
  }

  goToNoti(){
    this.router.navigate(['/notification']);
  }

  goTOChat(){
    this.router.navigate(['/live-chat']);
  }

  viewAll(){
    this.router.navigate(['/tabs/tab2']);
  }

  getCat() {
    this.router.navigate(['/tabs/servicepage']);
  }

  search() {
    this.router.navigate(['/tabs/tab2'], { 
      queryParams: { focus: 'search' }
    });
  }
}
