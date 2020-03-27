import { TestBed } from '@angular/core/testing';

import { RuleSetsService } from './rule-sets.service';

describe('RuleSetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RuleSetsService = TestBed.get(RuleSetsService);
    expect(service).toBeTruthy();
  });
});
