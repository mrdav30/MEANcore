import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../utils';
import { RecoverPasswordComponent } from './recover-password.component';

describe('RecoverPasswordComponent', () => {
  let component: RecoverPasswordComponent;
  let fixture: ComponentFixture<RecoverPasswordComponent>;
  beforeEach(() => {
    const routerStub = { navigate: () => ({}) };
    const activatedRouteStub = { params: { subscribe: () => ({}) } };
    const authServiceStub = {
      signIn: () => ({ subscribe: () => ({}) }),
      forgot: () => ({ subscribe: () => ({}) }),
      user: {},
      redirectUrl: {}
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [RecoverPasswordComponent],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: AuthService, useValue: authServiceStub }
      ]
    });
    fixture = TestBed.createComponent(RecoverPasswordComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('isSecretValidated defaults to: false', () => {
    expect(component.isSecretValidated).toEqual(false);
  });
  it('isSecretReset defaults to: false', () => {
    expect(component.isSecretReset).toEqual(false);
  });
  describe('recoverPassword', () => {
    it('makes expected calls', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      spyOn(authServiceStub, 'signIn');
      spyOn(authServiceStub, 'forgot');
      component.recoverPassword();
      expect(authServiceStub.signIn).toHaveBeenCalled();
      expect(authServiceStub.forgot).toHaveBeenCalled();
    });
  });
  describe('redirectPostLogin', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, 'navigate');
      component.redirectPostLogin();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});
