import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCategoria } from './editar-categoria';

describe('EditarCategoria', () => {
  let component: EditarCategoria;
  let fixture: ComponentFixture<EditarCategoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarCategoria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCategoria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
