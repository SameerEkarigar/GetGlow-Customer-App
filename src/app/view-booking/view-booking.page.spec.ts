import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewBookingPage } from './view-booking.page';

describe('ViewBookingPage', () => {
  let component: ViewBookingPage;
  let fixture: ComponentFixture<ViewBookingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
