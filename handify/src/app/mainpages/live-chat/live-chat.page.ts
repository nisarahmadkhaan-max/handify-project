import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-live-chat',
  templateUrl: './live-chat.page.html',
  styleUrls: ['./live-chat.page.scss'],
  standalone: false
})
export class LiveChatPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  messages: any[] = [];
  newMessage: string = '';
  bookingId: string = '';
  receiverId: string = '';
  receiverName: string = '';
  currentUserId: string = '';
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService,
    public translationService: TranslationService
  ) { }

  ngOnInit() {
    this.currentUserId = this.authService.currentUserValue?.user?._id;

    this.route.queryParams.subscribe(params => {
      this.bookingId = params['bookingId'];
      this.receiverId = params['receiverId'];
      this.receiverName = params['receiverName'] || 'Chat';

      if (this.bookingId) {
        this.loadMessages();
      }
    });
  }

  loadMessages() {
    this.loading = true;
    this.chatService.getMessages(this.bookingId).subscribe({
      next: (res: any) => {
        this.messages = res.data || [];
        this.loading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const messageData: ChatMessage = {
      bookingId: this.bookingId,
      receiverId: this.receiverId,
      text: this.newMessage,
      type: 'text'
    };

    this.chatService.sendMessage(messageData).subscribe({
      next: (res: any) => {
        this.messages.push(res.data);
        this.newMessage = '';
        this.scrollToBottom();
      }
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(300);
      }
    }, 100);
  }

  goBack() {
    this.router.navigate(['/request-details', this.bookingId]);
  }
}
