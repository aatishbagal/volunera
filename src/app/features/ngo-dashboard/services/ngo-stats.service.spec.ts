import { TestBed } from '@angular/core/testing';

import { NgoStatsService } from './ngo-stats.service';

describe('NgoStatsService', () => {
  let service: NgoStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgoStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
