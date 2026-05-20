import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
let AuthService = class AuthService {
    constructor(http) {
        this.http = http;
        // private apiUrl = "https://711b-175-107-215-25.ngrok-free.app/api"
        this.apiUrl = "http://localhost:3000/api";
        this.currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser') || 'null'));
        this.currentUser = this.currentUserSubject.asObservable();
    }
    get currentUserValue() {
        return this.currentUserSubject.value;
    }
    login(credentials) {
        return this.http.post(`${this.apiUrl}/auth/login`, credentials)
            .pipe(map(response => {
            // store user details and jwt token in local storage
            localStorage.setItem('currentUser', JSON.stringify(response));
            this.currentUserSubject.next(response);
            return response;
        }));
    }
    signup(userData) {
        return this.http.post(`${this.apiUrl}/auth/signup`, userData)
            .pipe(map(response => {
            // store user details and jwt token in local storage
            localStorage.setItem('currentUser', JSON.stringify(response));
            this.currentUserSubject.next(response);
            return response;
        }));
    }
    forgotPassword(phoneNumber) {
        return this.http.post(`${this.apiUrl}/auth/forgot-password`, { phoneNumber });
    }
    resetPassword(data) {
        return this.http.post(`${this.apiUrl}/auth/reset-password`, data);
    }
    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
    // New methods to handle login status and onboarding
    async isLoggedIn() {
        const user = this.currentUserValue;
        if (!user)
            return false;
        // Check if token exists and is not expired
        try {
            const token = user.token;
            if (!token)
                return false;
            // You could also verify the token with the backend here
            // For now, we'll just check if it exists
            return true;
        }
        catch {
            return false;
        }
    }
    async hasSeenOnboarding() {
        return localStorage.getItem('hasSeenOnboarding') === 'true';
    }
    async setHasSeenOnboarding() {
        localStorage.setItem('hasSeenOnboarding', 'true');
    }
    async getUserData() {
        return this.currentUserValue;
    }
};
AuthService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map