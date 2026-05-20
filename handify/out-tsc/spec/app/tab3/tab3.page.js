import { __decorate } from "tslib";
import { Component } from '@angular/core';
let Tab3Page = class Tab3Page {
    constructor(router, requestService) {
        this.router = router;
        this.requestService = requestService;
        this.activeFilter = 'All';
        this.requests = [];
        this.filteredRequests = [];
        this.loading = false;
        this.error = null;
    }
    ngOnInit() {
        this.fetchRequests();
    }
    fetchRequests() {
        this.loading = true;
        this.error = null;
        this.requestService.getRequests().subscribe({
            next: (data) => {
                this.requests = data;
                this.filterRequests(this.activeFilter);
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load requests.';
                this.loading = false;
            }
        });
    }
    filterRequests(filter) {
        this.activeFilter = filter;
        if (filter === 'All') {
            this.filteredRequests = [...this.requests];
        }
        else {
            this.filteredRequests = this.requests.filter(request => request.status === filter);
        }
    }
    viewRequestDetails(request) {
        this.router.navigate(['/request-details', request.id]);
    }
    getStatusColor(status) {
        switch (status) {
            case 'Confirmed':
                return 'green';
            case 'Pending':
                return 'gold';
            case 'Cancelled':
                return 'red';
            case 'Completed':
                return 'blue';
            default:
                return 'gray';
        }
    }
    formatDateTime(dateTime) {
        if (!dateTime)
            return '';
        // Split by comma and trim
        const first = dateTime.split(',')[0].trim();
        // Try to parse as ISO or fallback
        const date = new Date(first);
        if (isNaN(date.getTime()))
            return first; // fallback to raw if invalid
        // Format as 'MMM d, y, h:mm a'
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
};
Tab3Page = __decorate([
    Component({
        selector: 'app-tab3',
        templateUrl: './tab3.page.html',
        styleUrls: ['./tab3.page.scss'],
        standalone: false
    })
], Tab3Page);
export { Tab3Page };
//# sourceMappingURL=tab3.page.js.map