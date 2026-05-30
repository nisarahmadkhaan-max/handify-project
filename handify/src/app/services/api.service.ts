import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Bookings
  getMyBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/my-bookings`);
  }

  getBooking(bookingId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/${bookingId}`);
  }

  acceptBooking(bookingId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings/${bookingId}/accept`, {});
  }

  completeBooking(bookingId: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings/${bookingId}/complete`, { otp });
  }

  rateBooking(bookingId: string, rating: number, review: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings/${bookingId}/rate`, { rating, review });
  }

  // Settings
  getSetting(key: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/settings/key/${key}`);
  }

  // Employee & Wallet
  registerEmployee(employeeData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/employees/register`, employeeData);
  }

  submitTopupRequest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/wallet/request`, data);
  }

  getEmployeeProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/employees/profile`);
  }

  // Services & Others
  getAllServices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/services`);
  }

  getServicesByCategory(category: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/services/category/${category}`);
  }

  getNotifications(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications?userId=${userId}`);
  }

  submitContactSupportRequest(data: { subject: string; message: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact-support`, data);
  }
}
