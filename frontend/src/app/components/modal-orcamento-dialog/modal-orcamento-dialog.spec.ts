import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOrcamentoDialog } from './modal-orcamento-dialog';

describe('ModalOrcamentoDialog', () => {
  let component: ModalOrcamentoDialog;
  let fixture: ComponentFixture<ModalOrcamentoDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalOrcamentoDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalOrcamentoDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
