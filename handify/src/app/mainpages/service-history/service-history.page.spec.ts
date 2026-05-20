import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceHistoryPage } from './service-history.page';

describe('ServiceHistoryPage', () => {
  let component: ServiceHistoryPage;
  let fixture: ComponentFixture<ServiceHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
