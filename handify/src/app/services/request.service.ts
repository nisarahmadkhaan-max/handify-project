import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Request {
  _id: string;
  category: string;
  service: string;
  estimatedCost: number;
  date: string;
  time: string;
  location: string;
  additionalInstructions: string;
  status: string;
  userId: any; // Can be object or ID
  employeeId?: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = environment.apiUrl;
  private refreshSubject = new Subject<void>();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const token = currentUser?.token || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get my bookings (works for both user and employee based on token)
  getMyRequests(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bookings/my-bookings`, { headers: this.getHeaders() });
  }

  // Get single booking by ID
  getRequestById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bookings/${id}`, { headers: this.getHeaders() });
  }

  // Employee accepts a request
  acceptRequest(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/bookings/${id}/accept`, {}, { headers: this.getHeaders() });
  }

  // Employee rejects/ignores a broadcasted request
  rejectRequest(id: string): Observable<any> {
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }

  refreshRequests() {
    this.refreshSubject.next();
  }

  onRefresh(): Observable<void> {
    return this.refreshSubject.asObservable();
  }
}
