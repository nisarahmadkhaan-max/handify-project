import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: false
})
export class Tab2Page implements OnInit {
  @ViewChild('searchBar') searchBar!: IonSearchbar;
  @ViewChild('voiceSearchBtn') voiceSearchBtn!: ElementRef;
  
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  isListening = false;
  isStartingRecognition = false;
  private recognitionTimeout: any;
  private retryCount = 0;
  private maxRetries = 3;
  currentLang = 'en';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private toastController: ToastController,
    public translationService: TranslationService
  ) {
    // Set up search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.performSearch(term);
    });
  }

  private async showToast(message: string, color: string = 'danger', duration: number = 2000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
      position: 'bottom',
      buttons: color === 'success' ? [] : [{
        text: 'OK',
        role: 'cancel'
      }]
    });
    await toast.present();
  }

  private async checkMicrophonePermission(): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform()) {
        // For native platforms, check if we can access the microphone
        const { speechRecognition } = await SpeechRecognition.checkPermissions();
        return speechRecognition === 'granted';
      } else {
        // For web platforms, use the old method
        if (navigator && navigator.permissions) {
          const perm = await (navigator as any).permissions.query({ name: 'microphone' as PermissionName });
          console.log('Microphone permission state:', perm.state);
          return perm.state === 'granted';
        }
        return true;
      }
    } catch (err) {
      console.log('Error checking microphone permission:', err);
      return true;
    }
  }

  private async requestMicrophonePermission(): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform()) {
        const { speechRecognition } = await SpeechRecognition.requestPermissions();
        return speechRecognition === 'granted';
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        console.log('Microphone permission granted');
        return true;
      }
    } catch (err) {
      console.error('Error requesting microphone permission:', err);
      return false;
    }
  }

  async startVoiceSearch() {
    console.log('Starting voice search...');
    
    // Prevent multiple simultaneous calls
    if (this.isStartingRecognition) {
      console.log('Already starting recognition, ignoring call');
      return;
    }
    
    this.isStartingRecognition = true;
    
    try {
      // Check microphone permission
      console.log('Checking microphone permission...');
      let hasPermission = await this.checkMicrophonePermission();
      
      if (!hasPermission) {
        console.log('Permission not granted, requesting permission...');
        this.showToast('Requesting microphone permission...', 'info');
        hasPermission = await this.requestMicrophonePermission();
        
        if (!hasPermission) {
          this.showToast('Microphone permission is required. Please allow microphone access in your device settings.', 'danger', 4000);
          return;
        }
      }

      // Set listening state immediately for UI feedback
      this.isListening = true;
      
      await this.startSpeechRecognition();
    } catch (error) {
      console.error('Error in startVoiceSearch:', error);
      this.showToast('Error starting voice search. Please try again.', 'danger');
      this.isListening = false;
    } finally {
      this.isStartingRecognition = false;
    }
  }

  private async startSpeechRecognition() {
    try {
      console.log('Starting speech recognition...');
      
      // Ensure we're not already listening
      if (this.isListening) {
        console.log('Already listening, stopping first');
        this.stopVoiceSearch();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Start speech recognition using Capacitor plugin
      await SpeechRecognition.start({
        language: 'en-US',
        prompt: 'Speak to search for services...',
        partialResults: true,
        maxResults: 1
      });

      console.log('Speech recognition started successfully');
      this.isListening = true;
      
      // Set up listeners for the speech recognition events
      SpeechRecognition.addListener('partialResults', (result: any) => {
        console.log('Partial results:', result);
        if (result.matches && result.matches.length > 0) {
          const transcript = result.matches[0];
          this.searchTerm = transcript;
          this.searchSubject.next(transcript);
        }
      });

      SpeechRecognition.addListener('listeningState', (result: any) => {
        console.log('Listening state changed:', result);
        if (result.status === 'stopped') {
          this.isListening = false;
          this.isStartingRecognition = false;
          
          // If we have a search term when stopping, perform the search
          if (this.searchTerm.trim()) {
            this.performSearch(this.searchTerm);
            this.showToast(`Searching for: "${this.searchTerm}"`, 'success', 1500);
          }
        }
      });

    } catch (error) {
      console.error('Error starting speech recognition:', error);
      this.isListening = false;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Provide more specific error messages
      if (errorMessage.includes('permission')) {
        this.showToast('Microphone permission is required. Please allow microphone access in your device settings.', 'danger', 4000);
      } else if (errorMessage.includes('network')) {
        this.showToast('Network error. Please check your internet connection.', 'danger');
      } else {
        this.showToast(`Error starting voice search: ${errorMessage}`, 'danger');
      }
      
      // Retry logic
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Retrying voice search (attempt ${this.retryCount}/${this.maxRetries})...`);
        setTimeout(() => {
          this.startSpeechRecognition();
        }, 1000);
      } else {
        this.retryCount = 0;
        this.showToast('Voice search failed after multiple attempts. Please try again later.', 'danger');
      }
    }
  }

  private handleRecognitionError(error: string) {
    this.isListening = false;
    this.isStartingRecognition = false;
    
    // Clear timeout
    if (this.recognitionTimeout) {
      clearTimeout(this.recognitionTimeout);
      this.recognitionTimeout = null;
    }
    
    switch (error) {
      case 'audio-capture':
        this.showToast('No microphone detected. Please check your device.', 'danger');
        break;
      case 'not-allowed':
        this.handlePermissionDenied();
        break;
      case 'network':
        this.showToast('Network error. Please check your internet connection.', 'danger');
        break;
      case 'service-not-allowed':
        this.showToast('Speech recognition service not available.', 'danger');
        break;
      case 'aborted':
        console.log('Speech recognition aborted');
        break;
      default:
        this.showToast(`Speech recognition error: ${error}`, 'danger');
    }
  }

  private async handlePermissionDenied() {
    console.log('Microphone permission denied, attempting to request permission...');
    this.showToast('Microphone access denied. Please allow microphone access and try again.', 'danger', 3000);
    
    // Try to request permission again after a delay
    setTimeout(async () => {
      const granted = await this.requestMicrophonePermission();
      if (granted) {
        this.showToast('Permission granted! Try voice search again.', 'success');
        // Auto-retry after permission is granted
        setTimeout(() => {
          this.startVoiceSearch();
        }, 1000);
      } else {
        this.showToast('Please enable microphone access in your device settings.', 'danger', 4000);
      }
    }, 2000);
  }

  async stopVoiceSearch() {
    try {
      console.log('Stopping speech recognition...');
      this.isListening = false; // Set this first to prevent auto-restart
      
      // Stop speech recognition
      await SpeechRecognition.stop();
      console.log('Speech recognition stopped successfully');
      
      // Remove all listeners
      SpeechRecognition.removeAllListeners();
      
      // Trigger search with the current search term when manually stopped
      if (this.searchTerm.trim()) {
        this.performSearch(this.searchTerm);
        this.showToast(`Searching for: "${this.searchTerm}"`, 'success', 1500);
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      this.isListening = false;
      // Remove listeners even if stop fails
      try {
        SpeechRecognition.removeAllListeners();
      } catch (e) {
        console.log('Error removing listeners:', e);
      }
    }
    
    // Clear timeout
    if (this.recognitionTimeout) {
      clearTimeout(this.recognitionTimeout);
      this.recognitionTimeout = null;
    }
  }

  ngOnInit() {
    this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
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
        this.showToast('Error loading categories. Please try again.', 'danger');
      }
    });
  }

  filterCategories(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.searchTerm = searchTerm;
    this.searchSubject.next(searchTerm);
  }

  private performSearch(term: string) {
    if (!term.trim()) {
      this.filteredCategories = this.categories;
      return;
    }

    this.filteredCategories = this.categories.filter(category =>
      category.name.toLowerCase().includes(term.toLowerCase())
    );

    if (this.filteredCategories.length === 0) {
      this.showToast('No results found', 'warning');
    }
  }

  getCat(category: Category) {
    this.router.navigate(['/tabs/servicepage'], {
      queryParams: { 
        categoryId: category._id,
        categoryName: category.name,
        categoryImage: category.image
      }
    });
  }

  goToNoti() {
    this.router.navigate(['/notification']);
  }

  goTOChat() {
    this.router.navigate(['/live-chat']);
  }

  switchLanguage(lang: string) {
    this.translationService.setLanguage(lang);
  }
}

