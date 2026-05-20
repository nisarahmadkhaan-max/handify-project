import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicepagePage } from './servicepage.page';

describe('ServicepagePage', () => {
  let component: ServicepagePage;
  let fixture: ComponentFixture<ServicepagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicepagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
