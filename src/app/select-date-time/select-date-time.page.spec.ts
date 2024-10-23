import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectDateTimePage } from './select-date-time.page';

describe('SelectDateTimePage', () => {
  let component: SelectDateTimePage;
  let fixture: ComponentFixture<SelectDateTimePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDateTimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
