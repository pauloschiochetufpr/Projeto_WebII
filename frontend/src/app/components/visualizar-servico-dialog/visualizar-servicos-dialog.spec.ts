import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarServicosDialog } from './visualizar-servicos-dialog';

describe('VisualizarServicosDialog', () => {
  let component: VisualizarServicosDialog;
  let fixture: ComponentFixture<VisualizarServicosDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarServicosDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarServicosDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
