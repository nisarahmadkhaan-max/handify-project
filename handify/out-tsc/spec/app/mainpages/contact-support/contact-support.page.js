import { __decorate } from "tslib";
import { Component } from '@angular/core';
let ContactSupportPage = class ContactSupportPage {
    constructor(router) {
        this.router = router;
        this.phoneNumber = '1-800-123-4567';
        this.emailAddress = 'support@localconnect.com';
        this.supportRequest = {
            subject: '',
            message: ''
        };
    }
    ngOnInit() {
    }
    callNow() {
        window.open(`tel:${this.phoneNumber.replace(/-/g, '')}`);
    }
    sendEmail() {
        window.open(`mailto:${this.emailAddress}`);
    }
    submitRequest() {
        // In a real app, you would send the request to your backend
        // For demo purposes, we'll just navigate to the confirmation page
        const requestDetails = {
            id: '#ABC123',
            submitted: 'May 10, 2025, 2:15 PM',
            description: this.supportRequest.subject,
            status: 'Pending'
        };
        // Store request details to access them in the confirmation page
        localStorage.setItem('requestDetails', JSON.stringify(requestDetails));
        // Navigate to the confirmation page
        this.router.navigate(['/request-submitted']);
    }
};
ContactSupportPage = __decorate([
    Component({
        selector: 'app-contact-support',
        templateUrl: './contact-support.page.html',
        styleUrls: ['./contact-support.page.scss'],
        standalone: false
    })
], ContactSupportPage);
export { ContactSupportPage };
//# sourceMappingURL=contact-support.page.js.map