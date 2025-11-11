import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFuncionario } from './home-funcionario';

describe('HomeFuncionario', () => {
  let component: HomeFuncionario;
  let fixture: ComponentFixture<HomeFuncionario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeFuncionario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeFuncionario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
