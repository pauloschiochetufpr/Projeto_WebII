import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerarRelatorio } from './gerar-relatorio';

describe('GerarRelatorio', () => {
  let component: GerarRelatorio;
  let fixture: ComponentFixture<GerarRelatorio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerarRelatorio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerarRelatorio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
