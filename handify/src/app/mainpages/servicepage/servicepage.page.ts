import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { TranslationService } from '../../services/translation.service';
import { Router, ActivatedRoute } from '@angular/router';

interface Service {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  price: number;
}

@Component({
  selector: 'app-servicepage',
  templateUrl: './servicepage.page.html',
  styleUrls: ['./servicepage.page.scss'],
  standalone: false
})
export class ServicepagePage implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  loading: boolean = true;
  error: string = '';
  showSearchBar: boolean = false;
  searchTerm: string = '';
  selectedCategory: any = null;
  currentLang = 'en';

  // Dynamic Commission Rates (Default values)
  commissions = {
    low: 5,
    mid: 10,
    high: 15
  };

  constructor(
    private navCtrl: NavController,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public translationService: TranslationService
  ) { }

  ngOnInit() {
    this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });

    // Fetch Dynamic Commissions from Backend
    this.loadCommissions();

    this.route.queryParams.subscribe(params => {
      if (params['categoryName']) {
        this.selectedCategory = {
          id: params['categoryId'] || '',
          name: params['categoryName'],
          image: params['categoryImage'] || ''
        };
        this.loadServices();
      } else {
        this.selectedCategory = { name: 'Plumbing' };
        this.loadServices();
      }
    });
  }

  loadCommissions() {
    this.apiService.getSetting('commission_low').subscribe({ next: (res: any) => this.commissions.low = parseFloat(res.data) || 5 });
    this.apiService.getSetting('commission_mid').subscribe({ next: (res: any) => this.commissions.mid = parseFloat(res.data) || 10 });
    this.apiService.getSetting('commission_high').subscribe({ next: (res: any) => this.commissions.high = parseFloat(res.data) || 15 });
  }

  loadServices() {
    this.loading = true;
    this.error = '';
    const categoryName = this.selectedCategory?.name;

    this.apiService.getServicesByCategory(categoryName).subscribe({
      next: (data) => {
        this.services = data;
        this.filteredServices = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load services.';
        this.loading = false;
      }
    });
  }

  getFinalPrice(base: number): number {
    if (!base) return 0;
    let percentage = 0;

    // Using dynamic commission rates from backend
    if (base <= 500) percentage = this.commissions.low / 100;
    else if (base <= 800) percentage = this.commissions.mid / 100;
    else percentage = this.commissions.high / 100;

    return Math.round(base + (base * percentage));
  }

  // Other methods remain same...
  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
    if (!this.showSearchBar) {
      this.searchTerm = '';
      this.filteredServices = [...this.services];
    }
  }

  onSearchChange(event: any) {
    const value = event.detail.value.toLowerCase();
    this.filteredServices = this.services.filter(service =>
      service.name.toLowerCase().includes(value) ||
      service.description.toLowerCase().includes(value)
    );
  }

  bookservice(service: Service) {
    this.router.navigate(['/bookservice'], {
      queryParams: { service: JSON.stringify(service) }
    });
  }

  goBack() {
    this.router.navigate(['/tabs/tab2']);
  }
}
