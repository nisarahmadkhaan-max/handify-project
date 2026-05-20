import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let CategoryService = class CategoryService {
    constructor(http) {
        this.http = http;
        // private apiUrl = 'https://711b-175-107-215-25.ngrok-free.app/api/categories';
        this.apiUrl = 'http://localhost:3000/api/categories';
    }
    // Get all categories
    getAllCategories() {
        return this.http.get(this.apiUrl);
    }
    // Get featured categories (for home page)
    getFeaturedCategories(limit = 3) {
        return this.http.get(`${this.apiUrl}/featured?limit=${limit}`);
    }
    // Search categories
    searchCategories(query) {
        return this.http.get(`${this.apiUrl}/search?q=${query}`);
    }
    // Get category by ID
    getCategoryById(id) {
        return this.http.get(`${this.apiUrl}/${id}`);
    }
};
CategoryService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CategoryService);
export { CategoryService };
//# sourceMappingURL=category.service.js.map