import { __decorate } from "tslib";
import { Component } from '@angular/core';
let ServicepagePage = class ServicepagePage {
    constructor(navCtrl, apiService, router) {
        this.navCtrl = navCtrl;
        this.apiService = apiService;
        this.router = router;
        this.services = [];
        this.loading = true;
        this.error = '';
    }
    ngOnInit() {
        this.loadServices();
    }
    loadServices() {
        this.loading = true;
        this.apiService.getServicesByCategory('plumbing').subscribe({
            next: (data) => {
                this.services = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load services. Please try again later.';
                this.loading = false;
                console.error('Error loading services:', err);
            }
        });
    }
    bookservice(service) {
        // Pass the service data to the booking page as a query param
        this.router.navigate(['/bookservice'], {
            queryParams: { service: JSON.stringify(service) }
        });
    }
};
ServicepagePage = __decorate([
    Component({
        selector: 'app-servicepage',
        templateUrl: './servicepage.page.html',
        styleUrls: ['./servicepage.page.scss'],
        standalone: false
    })
], ServicepagePage);
export { ServicepagePage };
//# sourceMappingURL=servicepage.page.js.map