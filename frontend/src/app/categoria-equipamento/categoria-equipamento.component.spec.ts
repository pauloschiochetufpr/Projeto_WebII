import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaEquipamentoComponent } from './categoria-equipamento.component';

describe('CategoriaEquipamentoComponent', () => {
  let component: CategoriaEquipamentoComponent;
  let fixture: ComponentFixture<CategoriaEquipamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaEquipamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaEquipamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
