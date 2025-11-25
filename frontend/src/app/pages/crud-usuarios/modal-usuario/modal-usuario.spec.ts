import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUsuario } from './modal-usuario';

describe('ModalUsuario', () => {
  let component: ModalUsuario;
  let fixture: ComponentFixture<ModalUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
