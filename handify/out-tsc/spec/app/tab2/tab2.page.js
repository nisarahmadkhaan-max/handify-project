import { __decorate } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
let Tab2Page = class Tab2Page {
    constructor(router, route, categoryService, toastController) {
        this.router = router;
        this.route = route;
        this.categoryService = categoryService;
        this.toastController = toastController;
        this.categories = [];
        this.filteredCategories = [];
        this.searchTerm = '';
        this.searchSubject = new Subject();
        this.isListening = false;
        // Set up search debouncing
        this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(term => {
            this.performSearch(term);
        });
        // Initialize speech recognition
        this.initializeSpeechRecognition();
    }
    async showToast(message, color = 'danger') {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000,
            color: color,
            position: 'bottom'
        });
        await toast.present();
    }
    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new window.webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (transcript.trim()) {
                    this.searchTerm = transcript;
                    this.performSearch(transcript);
                    this.showToast('Voice input received', 'success');
                }
                else {
                    this.showToast('No speech detected. Please try again.');
                }
                this.isListening = false;
            };
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                switch (event.error) {
                    case 'no-speech':
                        this.showToast('No speech detected. Please try again.');
                        break;
                    case 'audio-capture':
                        this.showToast('No microphone detected. Please check your device.');
                        break;
                    case 'not-allowed':
                        this.showToast('Microphone access denied. Please allow microphone access.');
                        break;
                    default:
                        this.showToast('Error with speech recognition. Please try again.');
                }
            };
            this.recognition.onend = () => {
                this.isListening = false;
            };
        }
        else {
            console.warn('Speech recognition not supported in this browser');
            this.showToast('Speech recognition is not supported in your browser.');
        }
    }
    startVoiceSearch() {
        if (!this.recognition) {
            this.showToast('Speech recognition is not available.');
            return;
        }
        try {
            this.isListening = true;
            this.recognition.start();
            this.showToast('Recording started...', 'success');
        }
        catch (error) {
            console.error('Error starting speech recognition:', error);
            this.isListening = false;
            this.showToast('Error starting voice search. Please try again.');
        }
    }
    stopVoiceSearch() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            this.showToast('Recording stopped. Processing...', 'success');
        }
    }
    ngOnInit() {
        this.loadAllCategories();
        this.route.queryParams.subscribe(params => {
            if (params['focus'] === 'search') {
                setTimeout(() => {
                    this.searchBar?.setFocus();
                }, 100);
            }
        });
    }
    loadAllCategories() {
        this.categoryService.getAllCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
                this.filteredCategories = categories;
            },
            error: (error) => {
                console.error('Error loading categories:', error);
                this.showToast('Error loading categories. Please try again.');
            }
        });
    }
    filterCategories(event) {
        const searchTerm = event.target.value.toLowerCase();
        this.searchTerm = searchTerm;
        this.performSearch(searchTerm);
    }
    performSearch(term) {
        if (!term.trim()) {
            this.filteredCategories = this.categories;
            return;
        }
        this.filteredCategories = this.categories.filter(category => category.name.toLowerCase().includes(term.toLowerCase()));
        if (this.filteredCategories.length === 0) {
            this.showToast('No results found', 'warning');
        }
    }
    getCat() {
        this.router.navigate(['/tabs/servicepage']);
    }
    goToNoti() {
        this.router.navigate(['/notification']);
    }
    goTOChat() {
        this.router.navigate(['/live-chat']);
    }
};
__decorate([
    ViewChild('searchBar')
], Tab2Page.prototype, "searchBar", void 0);
__decorate([
    ViewChild('voiceSearchBtn')
], Tab2Page.prototype, "voiceSearchBtn", void 0);
Tab2Page = __decorate([
    Component({
        selector: 'app-tab2',
        templateUrl: './tab2.page.html',
        styleUrls: ['./tab2.page.scss'],
        standalone: false
    })
], Tab2Page);
export { Tab2Page };
//# sourceMappingURL=tab2.page.js.map