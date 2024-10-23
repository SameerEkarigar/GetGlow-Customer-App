import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpaLadiesPage } from './spa-ladies.page';

describe('SpaLadiesPage', () => {
  let component: SpaLadiesPage;
  let fixture: ComponentFixture<SpaLadiesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaLadiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
