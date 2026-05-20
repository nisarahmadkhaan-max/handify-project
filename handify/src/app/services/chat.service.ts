import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  _id?: string;
  bookingId: string;
  senderId?: string;
  receiverId: string;
  text: string;
  type: 'text' | 'audio' | 'image';
  audioLength?: string;
  timestamp?: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) {}

  sendMessage(message: ChatMessage): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send`, message);
  }

  getMessages(bookingId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/messages?bookingId=${bookingId}`);
  }
}
