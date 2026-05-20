import { __decorate } from "tslib";
import { Component } from '@angular/core';
let RequestDetailsPage = class RequestDetailsPage {
    constructor(route, router) {
        this.route = route;
        this.router = router;
        this.requestId = '';
        this.requestDetails = {
            serviceName: 'AC Repair',
            bookingId: '#AC789',
            location: '123 Main St, City, Country',
            dateTime: 'May 10, 2:00 PM',
            serviceCost: '$75',
            tax: '$5',
            total: '$80',
            paymentMethod: 'Cash on Work Done',
            provider: 'John Doe',
            contact: '(555) 123-4567',
            rating: '4.5/5',
            timeline: {
                requestSubmitted: 'May 10,1:00 PM',
                bookingConfirmed: 'May 10,1:05 PM',
                technicianAssigned: 'May 10,1:20 PM',
                technicianEnRoute: 'ETA: 15 mins'
            }
        };
    }
    ngOnInit() {
        this.requestId = this.route.snapshot.paramMap.get('id') || '';
        // In a real app, you would fetch the request details using the ID
    }
    closeDetails() {
        this.router.navigate(['/my-requests']);
    }
    callTechnician() {
        window.open(`tel:${this.requestDetails.contact.replace(/[^0-9]/g, '')}`);
    }
};
RequestDetailsPage = __decorate([
    Component({
        selector: 'app-request-details',
        templateUrl: './request-details.page.html',
        styleUrls: ['./request-details.page.scss'],
        standalone: false
    })
], RequestDetailsPage);
export { RequestDetailsPage };
//# sourceMappingURL=request-details.page.js.map