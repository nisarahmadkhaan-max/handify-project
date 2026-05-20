import { __decorate } from "tslib";
import { Component } from '@angular/core';
let Tab4Page = class Tab4Page {
    constructor(router, authService) {
        this.router = router;
        this.authService = authService;
        this.userProfile = {
            name: 'John Doe',
            tagline: 'Local Connect Member',
            email: 'custom@gmail.com',
            phone: '123-456-7890',
            location: 'C#4 rukun-ud-din square sharifabad fb block 1 karachi'
        };
        this.appVersion = '1.0';
    }
    ngOnInit() {
        const userData = this.authService.currentUserValue?.user;
        if (userData) {
            this.userProfile = {
                name: userData.fullName || '',
                tagline: 'Local Connect Member',
                email: userData.email || '',
                phone: userData.phoneNumber || '',
                location: 'C#4 rukun-ud-din square sharifabad fb block 1 karachi'
            };
        }
    }
    closeProfile() {
        this.router.navigate(['/tabs/tab1']);
    }
    editProfile() {
        this.router.navigate(['tabs/tab4/edit-profile']);
    }
    navigateTo(route) {
        this.router.navigate([`/${route}`]);
    }
    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
    openTerms() {
        // Open terms of service
        alert('Terms of Service would open here');
    }
    openPrivacy() {
        // Open privacy policy
        alert('Privacy Policy would open here');
    }
};
Tab4Page = __decorate([
    Component({
        selector: 'app-tab4',
        templateUrl: './tab4.page.html',
        styleUrls: ['./tab4.page.scss'],
        standalone: false
    })
], Tab4Page);
export { Tab4Page };
//# sourceMappingURL=tab4.page.js.map