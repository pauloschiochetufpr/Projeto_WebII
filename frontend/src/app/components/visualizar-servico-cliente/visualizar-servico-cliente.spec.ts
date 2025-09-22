import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarServicoCliente } from './visualizar-servico-cliente';

describe('VisualizarServicoCliente', () => {
  let component: VisualizarServicoCliente;
  let fixture: ComponentFixture<VisualizarServicoCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarServicoCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarServicoCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
