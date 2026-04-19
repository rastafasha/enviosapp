import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Orderlisthome } from './orderlisthome';

describe('Orderlisthome', () => {
  let component: Orderlisthome;
  let fixture: ComponentFixture<Orderlisthome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orderlisthome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Orderlisthome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
