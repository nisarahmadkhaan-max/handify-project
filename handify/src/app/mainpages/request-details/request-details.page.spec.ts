import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestDetailsPage } from './request-details.page';

describe('RequestDetailsPage', () => {
  let component: RequestDetailsPage;
  let fixture: ComponentFixture<RequestDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
