import { TestBed } from '@angular/core/testing';

import { Servico } from './servico';

describe('Servico', () => {
  let service: Servico;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Servico);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
