import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPackagesPage } from './my-packages.page';

describe('MyPackagesPage', () => {
  let component: MyPackagesPage;
  let fixture: ComponentFixture<MyPackagesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPackagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
