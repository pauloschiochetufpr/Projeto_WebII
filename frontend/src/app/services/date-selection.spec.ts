import { TestBed } from '@angular/core/testing';

import { DateSelection } from './date-selection';

describe('DateSelection', () => {
  let service: DateSelection;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateSelection);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
