import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactSupportPage } from './contact-support.page';

describe('ContactSupportPage', () => {
  let component: ContactSupportPage;
  let fixture: ComponentFixture<ContactSupportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactSupportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
