import { TestBed } from '@angular/core/testing';
import { OnboardingPage } from './onboarding.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslationService } from '../../services/translation.service';
class MockTranslationService {
}
describe('OnboardingPage', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OnboardingPage],
            imports: [CommonModule, IonicModule.forRoot(), HttpClientTestingModule],
            providers: [
                { provide: TranslationService, useClass: MockTranslationService },
                // Add other providers if needed
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(OnboardingPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=onboarding.page.spec.js.map