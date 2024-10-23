import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginOTPPage } from './login-otp.page';

describe('LoginOTPPage', () => {
  let component: LoginOTPPage;
  let fixture: ComponentFixture<LoginOTPPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginOTPPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
