import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  // Updated to use email
  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(map(response => {
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
        return response;
      }));
  }

  signup(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/auth/signup`, userData)
      .pipe(map(response => {
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
        return response;
      }));
  }

  updateLocation(location: string) {
    const current = this.currentUserValue;
    if (current && current.user) {
      current.user.location = location;
      localStorage.setItem('currentUser', JSON.stringify(current));
      this.currentUserSubject.next(current);

      this.http.put(`${this.apiUrl}/auth/profile`, { location }).subscribe({
        next: () => console.log('Location synced with server'),
        error: (err) => console.error('Failed to sync location', err)
      });
    }
  }

  async hasSeenOnboarding(): Promise<boolean> {
    return localStorage.getItem('hasSeenOnboarding') === 'true';
  }

  async setHasSeenOnboarding(): Promise<void> {
    localStorage.setItem('hasSeenOnboarding', 'true');
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  async isLoggedIn(): Promise<boolean> {
    return !!this.currentUserValue?.token;
  }

  updateCurrentUser(user: any) {
    const current = this.currentUserValue;
    if (current) {
      const updated = { ...current, user };
      localStorage.setItem('currentUser', JSON.stringify(updated));
      this.currentUserSubject.next(updated);
    }
  }

  // Updated to use email
  forgotPassword(email: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(data: { email: string; otp: string; newPassword: any }) {
    return this.http.post<any>(`${this.apiUrl}/auth/reset-password`, data);
  }
}
