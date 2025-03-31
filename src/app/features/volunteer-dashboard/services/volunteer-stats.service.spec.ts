import { TestBed } from '@angular/core/testing';

import { VolunteerStatsService } from './volunteer-stats.service';

describe('VolunteerStatsService', () => {
  let service: VolunteerStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VolunteerStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
