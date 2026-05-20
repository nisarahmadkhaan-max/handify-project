import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestSubmittedPage } from './request-submitted.page';

describe('RequestSubmittedPage', () => {
  let component: RequestSubmittedPage;
  let fixture: ComponentFixture<RequestSubmittedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestSubmittedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
