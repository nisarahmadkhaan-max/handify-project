import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // private apiUrl = 'https://711b-175-107-215-25.ngrok-free.app/api/categories';
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) { }

  // Get all categories
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  // Get featured categories (for home page)
  getFeaturedCategories(limit: number = 3): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/featured?limit=${limit}`);
  }

  // Search categories
  searchCategories(query: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/search?q=${query}`);
  }

  // Get category by ID
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }
} 