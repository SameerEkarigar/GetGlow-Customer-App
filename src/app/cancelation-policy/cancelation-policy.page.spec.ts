import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CancelationPolicyPage } from './cancelation-policy.page';

describe('CancelationPolicyPage', () => {
  let component: CancelationPolicyPage;
  let fixture: ComponentFixture<CancelationPolicyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelationPolicyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
