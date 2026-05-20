import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';

interface Notification {
  _id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
  standalone: false
})
export class NotificationPage implements OnInit {
  notifications: Notification[] = [];
  currentLang = 'en';

  constructor(private apiService: ApiService, private authService: AuthService, public translationService: TranslationService) { }

  ngOnInit() {
    this.translationService.currentLang$.subscribe((lang: string) => {
      this.currentLang = lang;
    });
    this.loadNotifications();
  }

  loadNotifications() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.user && currentUser.user._id) {
      const userId = currentUser.user._id;
      this.apiService.getNotifications(userId).subscribe({
        next: (data: Notification[]) => {
          this.notifications = data;
        },
        error: (err: unknown) => {
          console.error('Failed to load notifications:', err);
        }
      });
    } else {
      console.warn('No user logged in, cannot fetch notifications');
    }
  }

  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
    // Optionally, send a request to backend to mark all as read
  }

  switchLanguage(lang: string) {
    this.translationService.setLanguage(lang);
  }
}
