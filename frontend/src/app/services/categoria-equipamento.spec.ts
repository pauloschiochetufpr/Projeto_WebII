import { TestBed } from '@angular/core/testing';

import { CategoriaEquipamento } from './categoria-equipamento';

describe('CategoriaEquipamento', () => {
  let service: CategoriaEquipamento;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaEquipamento);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
