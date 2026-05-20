import { TestBed } from '@angular/core/testing';
import { SplashPage } from './splash.page';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
class MockStorage {
    constructor() {
        this.get = jasmine.createSpy('get');
        this.set = jasmine.createSpy('set');
        this.remove = jasmine.createSpy('remove');
    }
}
describe('SplashPage', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SplashPage],
            imports: [CommonModule, IonicModule.forRoot()],
            providers: [
                { provide: Storage, useClass: MockStorage },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(SplashPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=splash.page.spec.js.map