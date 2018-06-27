import { TestBed, inject } from '@angular/core/testing';

import { SwarmService } from './swarm.service';

describe('SwarmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SwarmService]
    });
  });

  it('should be created', inject([SwarmService], (service: SwarmService) => {
    expect(service).toBeTruthy();
  }));
});
