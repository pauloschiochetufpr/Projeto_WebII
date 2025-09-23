import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarManutencao } from './solicitar-manutencao';

describe('SolicitarManutencao', () => {
  let component: SolicitarManutencao;
  let fixture: ComponentFixture<SolicitarManutencao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarManutencao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitarManutencao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
