import { TestBed } from '@angular/core/testing';
import { BookingconfirmPage } from './bookingconfirm.page';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
class MockActivatedRoute {
}
describe('BookingconfirmPage', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BookingconfirmPage],
            imports: [CommonModule, IonicModule.forRoot()],
            providers: [
                { provide: ActivatedRoute, useClass: MockActivatedRoute },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(BookingconfirmPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=bookingconfirm.page.spec.js.map