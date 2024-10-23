import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationAccessPage } from './location-access.page';

describe('LocationAccessPage', () => {
  let component: LocationAccessPage;
  let fixture: ComponentFixture<LocationAccessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationAccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
