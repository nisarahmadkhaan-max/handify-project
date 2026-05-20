import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || !currentUser.token) {
      console.error('No user token found');
      throw new Error('No authentication token available');
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${currentUser.token}`,
      'Content-Type': 'application/json'
    });
  }

  createBooking(bookingData: any): Observable<any> {
    try {
      const headers = this.getHeaders();
      console.log('Creating booking with headers:', headers);
      return this.http.post(this.apiUrl, bookingData, { headers }).pipe(
        catchError(error => {
          console.error('Booking creation error:', error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('Error preparing booking request:', error);
      return throwError(() => error);
    }
  }

  getMyBookings(): Observable<any> {
    try {
      const headers = this.getHeaders();
      return this.http.get(`${this.apiUrl}/my-bookings`, { headers }).pipe(
        catchError(error => {
          console.error('Error fetching bookings:', error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('Error preparing bookings request:', error);
      return throwError(() => error);
    }
  }

  getBooking(id: string): Observable<any> {
    try {
      const headers = this.getHeaders();
      return this.http.get(`${this.apiUrl}/${id}`, { headers }).pipe(
        catchError(error => {
          console.error('Error fetching booking:', error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('Error preparing booking request:', error);
      return throwError(() => error);
    }
  }

  cancelBooking(id: string): Observable<any> {
    try {
      const headers = this.getHeaders();
      return this.http.patch(`${this.apiUrl}/${id}/cancel`, {}, { headers }).pipe(
        catchError(error => {
          console.error('Error cancelling booking:', error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('Error preparing cancel request:', error);
      return throwError(() => error);
    }
  }
} 