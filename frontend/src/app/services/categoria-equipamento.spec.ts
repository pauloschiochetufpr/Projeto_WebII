import { TestBed } from '@angular/core/testing';
import { CategoriaEquipamentoComponent } from '../pages/categoria-equipamento/categoria-equipamento.component';

describe('CategoriaEquipamento', () => {
  let service: CategoriaEquipamentoComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaEquipamentoComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
