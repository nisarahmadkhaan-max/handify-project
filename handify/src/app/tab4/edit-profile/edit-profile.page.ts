import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss']
})
export class EditProfilePage implements OnInit {
  profileForm: FormGroup;
  loading = false;
  error: string | null = null;
  currentLang = 'en';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    public translationService: TranslationService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      location: ['']
    });
  }

  ngOnInit() {
    this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
    const user = this.authService.currentUserValue?.user;
    if (user) {
      this.profileForm.patchValue({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        location: user.location || ''
      });
    }
  }

  async onSubmit() {
    if (this.profileForm.invalid) return;
    this.loading = true;
    this.error = null;
    try {
      const current = this.authService.currentUserValue;
      const token = current?.token;
      if (!token) {
        this.error = 'Not authenticated.';
        this.loading = false;
        return;
      }
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      const apiUrl = `${environment.apiUrl}/auth/profile`;
      const res: any = await this.http.put(apiUrl, this.profileForm.value, { headers }).toPromise();
      // Update local storage and AuthService
      if (current && res.user) {
        this.authService.updateCurrentUser(res.user);
      }
      this.router.navigate(['/tabs/tab4']);
    } catch (err: any) {
      this.error = err?.error?.message || 'Failed to update profile';
    } finally {
      this.loading = false;
    }
  }

  cancel() {
    this.router.navigate(['/tabs/tab4']);
  }

  switchLanguage(lang: string) {
    this.translationService.setLanguage(lang);
  }
} 