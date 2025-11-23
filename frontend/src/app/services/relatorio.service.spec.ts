import { TestBed } from '@angular/core/testing';

import { Relatorio } from './relatorio.service';

describe('Relatorio', () => {
  let service: Relatorio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Relatorio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
