import { __decorate } from "tslib";
import { Component } from '@angular/core';
let LiveChatPage = class LiveChatPage {
    constructor(router) {
        this.router = router;
        this.messages = [];
        this.newMessage = '';
        this.showWelcomeMessage = true;
        // For demo purposes, we'll simulate a conversation
        this.demoConversation = [
            {
                id: '1',
                text: 'I have a question about my booking – can you confirm the technician\'s ETA?',
                isUser: true,
                timestamp: '10:02 AM',
                type: 'text'
            },
            {
                id: '2',
                text: 'Sure, please hold on while I check that for you...',
                isUser: false,
                timestamp: '10:02 AM',
                type: 'text'
            },
            {
                id: '3',
                text: '', // Audio message doesn't need text
                isUser: true,
                timestamp: '10:02 AM',
                type: 'audio',
                audioLength: '0:05'
            },
            {
                id: '4',
                text: 'Thanks.',
                isUser: true,
                timestamp: '10:02 AM',
                type: 'text'
            }
        ];
    }
    ngOnInit() {
        // For demo purposes, we can load the conversation if needed
        // this.loadDemoConversation();
    }
    loadDemoConversation() {
        this.messages = [...this.demoConversation];
        this.showWelcomeMessage = false;
    }
    sendMessage() {
        if (!this.newMessage.trim())
            return;
        // Add user message
        this.messages.push({
            id: Date.now().toString(),
            text: this.newMessage,
            isUser: true,
            timestamp: this.getCurrentTime(),
            type: 'text'
        });
        this.showWelcomeMessage = false;
        this.newMessage = '';
        // Simulate agent response after a short delay
        setTimeout(() => {
            this.messages.push({
                id: Date.now().toString(),
                text: 'Sure, please hold on while I check that for you...',
                isUser: false,
                timestamp: this.getCurrentTime(),
                type: 'text'
            });
        }, 1000);
    }
    sendAudio() {
        // Simulate sending audio message
        this.messages.push({
            id: Date.now().toString(),
            text: '',
            isUser: true,
            timestamp: this.getCurrentTime(),
            type: 'audio',
            audioLength: '0:05'
        });
        this.showWelcomeMessage = false;
    }
    sendImage() {
        // This would handle image selection and sending
        alert('Image selection would open here');
    }
    getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        return `${hours}:${minutes} ${ampm}`;
    }
    goBack() {
        this.router.navigate(['/home']);
    }
};
LiveChatPage = __decorate([
    Component({
        selector: 'app-live-chat',
        templateUrl: './live-chat.page.html',
        styleUrls: ['./live-chat.page.scss'],
        standalone: false
    })
], LiveChatPage);
export { LiveChatPage };
//# sourceMappingURL=live-chat.page.js.map