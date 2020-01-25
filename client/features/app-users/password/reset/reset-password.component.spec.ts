import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../../../utils';
import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = { detectChanges: () => ({}) };
    const activatedRouteStub = { params: { subscribe: () => ({}) } };
    const authServiceStub = { reset: () => ({ subscribe: () => ({}) }) };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ResetPasswordComponent],
      imports: [
        FormsModule
      ],
      providers: [
        { provide: ChangeDetectorRef, useValue: changeDetectorRefStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: AuthService, useValue: authServiceStub }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.debugElement.componentInstance;

    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('isTokenInvalid defaults to: false', () => {
    expect(component.isTokenInvalid).toEqual(false);
  });
  it('isSecretReset defaults to: false', () => {
    expect(component.isSecretReset).toEqual(false);
  });
  describe('resetPassword', () => {
    beforeEach(() => {
      component.isTokenInvalid = false;
      component.isSecretReset = false;

      fixture.detectChanges();
    });
    it('alerts on invalid secret', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      spyOn(authServiceStub, 'reset').and.callFake(() => {
        return of({ invalidSecret: true });
      });
      component.resetPassword();
      expect(authServiceStub.reset).toHaveBeenCalled();
    });
    it('alerts on invalid token', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      spyOn(authServiceStub, 'reset').and.callFake(() => {
        return of({ tokenInvalid: true });
      });
      component.resetPassword();
      expect(authServiceStub.reset).toHaveBeenCalled();
      expect(component.isTokenInvalid).toEqual(true);
    });
    it('alerts when secret reset', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      spyOn(authServiceStub, 'reset').and.callFake(() => {
        return of({ secretReset: true });
      });
      component.resetPassword();
      expect(authServiceStub.reset).toHaveBeenCalled();
      expect(component.isSecretReset).toEqual(true);
    });
  });
});
