import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisEntregasComponent } from './mis-entregas.component';

describe('MisEntregasComponent', () => {
  let component: MisEntregasComponent;
  let fixture: ComponentFixture<MisEntregasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisEntregasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisEntregasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
