import { __decorate } from "tslib";
import { Component } from '@angular/core';
let RequestSubmittedPage = class RequestSubmittedPage {
    constructor(router) {
        this.router = router;
        this.phoneNumber = '1-800-123-4567';
        this.requestDetails = {
            id: '#ABC123',
            submitted: 'May 10, 2025, 2:15 PM',
            description: 'Issue with booking service',
            status: 'Pending'
        };
    }
    ngOnInit() {
        // In a real app, you would get this data from a service or state management
        const storedDetails = localStorage.getItem('requestDetails');
        if (storedDetails) {
            this.requestDetails = JSON.parse(storedDetails);
        }
    }
    backToHome() {
        this.router.navigate(['/home']);
    }
};
RequestSubmittedPage = __decorate([
    Component({
        selector: 'app-request-submitted',
        templateUrl: './request-submitted.page.html',
        styleUrls: ['./request-submitted.page.scss'],
        standalone: false
    })
], RequestSubmittedPage);
export { RequestSubmittedPage };
//# sourceMappingURL=request-submitted.page.js.map