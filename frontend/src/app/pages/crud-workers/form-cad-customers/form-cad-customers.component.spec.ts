import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCadCustomersComponent } from './form-cad-customers.component';

describe('FormCadCustomersComponent', () => {
  let component: FormCadCustomersComponent;
  let fixture: ComponentFixture<FormCadCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCadCustomersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCadCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
