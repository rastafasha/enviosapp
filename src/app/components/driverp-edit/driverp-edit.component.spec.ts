import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverpEditComponent } from './driverp-edit.component';

describe('DriverpEditComponent', () => {
  let component: DriverpEditComponent;
  let fixture: ComponentFixture<DriverpEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverpEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverpEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
