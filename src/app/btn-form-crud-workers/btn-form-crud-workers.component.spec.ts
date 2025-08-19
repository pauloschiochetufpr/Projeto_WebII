import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnFormCrudWorkersComponent } from './btn-form-crud-workers.component';

describe('BtnFormCrudWorkersComponent', () => {
  let component: BtnFormCrudWorkersComponent;
  let fixture: ComponentFixture<BtnFormCrudWorkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnFormCrudWorkersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnFormCrudWorkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
