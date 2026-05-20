import { __decorate } from "tslib";
import { Component } from '@angular/core';
let ServiceHistoryPage = class ServiceHistoryPage {
    constructor(router) {
        this.router = router;
        this.activeFilter = 'All';
        this.serviceHistory = [
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
        this.filteredHistory = [];
    }
    ngOnInit() {
        this.filterHistory('All');
    }
    filterHistory(filter) {
        this.activeFilter = filter;
        if (filter === 'All') {
            this.filteredHistory = [...this.serviceHistory];
        }
        else {
            this.filteredHistory = this.serviceHistory.filter(item => item.status === filter);
        }
    }
    getStatusColor(status) {
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
    getRatingStars(rating) {
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
    viewServiceDetails(service) {
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
};
ServiceHistoryPage = __decorate([
    Component({
        selector: 'app-service-history',
        templateUrl: './service-history.page.html',
        styleUrls: ['./service-history.page.scss'],
        standalone: false
    })
], ServiceHistoryPage);
export { ServiceHistoryPage };
//# sourceMappingURL=service-history.page.js.map