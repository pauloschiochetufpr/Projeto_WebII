import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeDatePicker } from './range-date-picker';

describe('RangeDatePicker', () => {
  let component: RangeDatePicker;
  let fixture: ComponentFixture<RangeDatePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeDatePicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangeDatePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
