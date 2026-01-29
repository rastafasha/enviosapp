import { TestBed } from '@angular/core/testing';

import { TipovehiculoService } from './tipovehiculo.service';

describe('TipovehiculoService', () => {
  let service: TipovehiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipovehiculoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
