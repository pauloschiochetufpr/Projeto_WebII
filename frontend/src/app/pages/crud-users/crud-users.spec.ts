import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudUsers } from './crud-users';

describe('CrudUsers', () => {
  let component: CrudUsers;
  let fixture: ComponentFixture<CrudUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
