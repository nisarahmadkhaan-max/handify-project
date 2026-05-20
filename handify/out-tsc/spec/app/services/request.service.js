import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let RequestService = class RequestService {
    constructor(http) {
        this.http = http;
        this.apiUrl = 'http://localhost:3000/api/requests'; // Adjust port if needed
    }
    getRequests() {
        return this.http.get(this.apiUrl);
    }
};
RequestService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], RequestService);
export { RequestService };
//# sourceMappingURL=request.service.js.map