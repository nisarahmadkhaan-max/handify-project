import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './services/auth.service';
class MockAuthService {
}
describe('AppComponent', () => {
    let fixture;
    let component;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [CommonModule, IonicModule.forRoot(), HttpClientTestingModule],
            providers: [
                { provide: AuthService, useClass: MockAuthService },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create the app', () => {
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
//# sourceMappingURL=app.component.spec.js.map