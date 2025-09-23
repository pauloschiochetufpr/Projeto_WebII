import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncHeader } from './func-header';

describe('FuncHeader', () => {
  let component: FuncHeader;
  let fixture: ComponentFixture<FuncHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
