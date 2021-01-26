import { TestBed } from '@angular/core/testing';

import { CreativestarService } from './creativestar.service';

describe('CreativestarService', () => {
  let service: CreativestarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreativestarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
