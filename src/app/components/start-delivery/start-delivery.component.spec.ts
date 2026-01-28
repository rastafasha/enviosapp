import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartDeliveryComponent } from './start-delivery.component';

describe('StartDeliveryComponent', () => {
  let component: StartDeliveryComponent;
  let fixture: ComponentFixture<StartDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartDeliveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
