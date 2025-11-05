import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inserir } from './inserir';

describe('Inserir', () => {
  let component: Inserir;
  let fixture: ComponentFixture<Inserir>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inserir]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Inserir);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
