import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredPasswordComponent } from './expired-password.component';

describe('ExpiredPasswordComponent', () => {
  let component: ExpiredPasswordComponent;
  let fixture: ComponentFixture<ExpiredPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiredPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
