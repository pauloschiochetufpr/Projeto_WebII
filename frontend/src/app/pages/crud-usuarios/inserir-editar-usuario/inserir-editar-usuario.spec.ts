import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirEditarUsuario } from './inserir-editar-usuario';

describe('InserirEditarUsuario', () => {
  let component: InserirEditarUsuario;
  let fixture: ComponentFixture<InserirEditarUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InserirEditarUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InserirEditarUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
