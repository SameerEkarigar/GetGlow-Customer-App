import { TestBed } from '@angular/core/testing';

import { RecentReturnService } from './recent-return.service';

describe('RecentReturnService', () => {
  let service: RecentReturnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecentReturnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
