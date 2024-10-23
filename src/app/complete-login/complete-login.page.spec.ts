import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompleteLoginPage } from './complete-login.page';

describe('CompleteLoginPage', () => {
  let component: CompleteLoginPage;
  let fixture: ComponentFixture<CompleteLoginPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
