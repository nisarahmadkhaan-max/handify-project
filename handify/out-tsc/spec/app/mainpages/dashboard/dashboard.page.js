import { __decorate } from "tslib";
import { Component } from '@angular/core';
let DashboardPage = class DashboardPage {
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
};
DashboardPage = __decorate([
    Component({
        selector: 'app-dashboard',
        templateUrl: './dashboard.page.html',
        styleUrls: ['./dashboard.page.scss'],
        standalone: false
    })
], DashboardPage);
export { DashboardPage };
//# sourceMappingURL=dashboard.page.js.map