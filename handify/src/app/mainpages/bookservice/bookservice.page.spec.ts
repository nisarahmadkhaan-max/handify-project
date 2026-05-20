import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookservicePage } from './bookservice.page';

describe('BookservicePage', () => {
  let component: BookservicePage;
  let fixture: ComponentFixture<BookservicePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BookservicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
