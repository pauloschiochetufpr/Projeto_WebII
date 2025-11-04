import { TestBed } from '@angular/core/testing';

import { CrudFuncionarios } from './crud-funcionarios';

describe('CrudFuncionarios', () => {
  let service: CrudFuncionarios;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudFuncionarios);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
