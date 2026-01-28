import { TestBed } from '@angular/core/testing';

import { DriverpService } from './driverp.service';

describe('DriverpService', () => {
  let service: DriverpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
