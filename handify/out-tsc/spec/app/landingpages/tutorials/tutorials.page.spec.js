import { TestBed } from '@angular/core/testing';
import { TutorialsPage } from './tutorials.page';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslationService } from '../../services/translation.service';
class MockTranslationService {
}
describe('TutorialsPage', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TutorialsPage],
            imports: [CommonModule, IonicModule.forRoot(), HttpClientTestingModule],
            providers: [
                { provide: TranslationService, useClass: MockTranslationService },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(TutorialsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=tutorials.page.spec.js.map