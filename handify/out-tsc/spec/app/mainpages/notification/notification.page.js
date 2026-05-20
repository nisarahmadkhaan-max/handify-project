import { __decorate } from "tslib";
import { Component } from '@angular/core';
let NotificationPage = class NotificationPage {
    constructor() {
        this.notifications = [
            {
                id: 1,
                title: 'Booking Confirmed!',
                message: 'Your service request for...',
                timestamp: 'May 1, 10:00 AM',
                isRead: false
            },
            {
                id: 2,
                title: 'Special Discount Offer',
                message: 'Enjoy 20% off on Cleaning.....',
                timestamp: 'May 1, 04:45 PM',
                isRead: false
            },
            {
                id: 3,
                title: 'Service Update',
                message: 'Your driver is on the way...',
                timestamp: 'May 1, 09:30 AM',
                isRead: false
            },
            {
                id: 4,
                title: 'Booking Confirmed!',
                message: 'Your service request for...',
                timestamp: 'May 1, 10:00 AM',
                isRead: true
            },
            {
                id: 5,
                title: 'Special Discount Offer',
                message: 'Enjoy 20% off on Cleaning.....',
                timestamp: 'May 1, 04:45 PM',
                isRead: true
            },
            {
                id: 6,
                title: 'Service Update',
                message: 'Your driver is on the way...',
                timestamp: 'May 1, 09:30 AM',
                isRead: true
            },
            {
                id: 7,
                title: 'Booking Confirmed!',
                message: 'Your service request for...',
                timestamp: 'May 1, 10:00 AM',
                isRead: true
            },
            {
                id: 8,
                title: 'Special Discount Offer',
                message: 'Enjoy 20% off on Cleaning.....',
                timestamp: 'May 1, 04:45 PM',
                isRead: true
            },
            {
                id: 9,
                title: 'Service Update',
                message: 'Your driver is on the way...',
                timestamp: 'May 1, 09:30 AM',
                isRead: true
            }
        ];
    }
    ngOnInit() {
    }
    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.isRead = true;
        });
    }
};
NotificationPage = __decorate([
    Component({
        selector: 'app-notification',
        templateUrl: './notification.page.html',
        styleUrls: ['./notification.page.scss'],
        standalone: false
    })
], NotificationPage);
export { NotificationPage };
//# sourceMappingURL=notification.page.js.map