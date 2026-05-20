import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let ApiService = class ApiService {
    constructor(http) {
        this.http = http;
        // private apiUrl = 'https://711b-175-107-215-25.ngrok-free.app/api'; // Update this with your backend URL 
        this.apiUrl = 'http://localhost:3000/api'; // Update this with your backend URL
    }
    // Get all services
    getAllServices() {
        return this.http.get(`${this.apiUrl}/services`);
    }
    // Get services by category
    getServicesByCategory(category) {
        return this.http.get(`${this.apiUrl}/services/category/${category}`);
    }
};
ApiService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ApiService);
export { ApiService };
//# sourceMappingURL=api.service.js.map