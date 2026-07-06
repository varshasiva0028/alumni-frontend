import { TestBed } from '@angular/core/testing';

import { AlumniService } from './alumni.service';

describe('Alumni', () => {
  let service: AlumniService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlumniService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
