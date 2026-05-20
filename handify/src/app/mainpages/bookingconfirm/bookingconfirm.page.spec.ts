import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingconfirmPage } from './bookingconfirm.page';

describe('BookingconfirmPage', () => {
  let component: BookingconfirmPage;
  let fixture: ComponentFixture<BookingconfirmPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingconfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
