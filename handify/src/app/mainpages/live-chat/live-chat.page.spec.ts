import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveChatPage } from './live-chat.page';

describe('LiveChatPage', () => {
  let component: LiveChatPage;
  let fixture: ComponentFixture<LiveChatPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
