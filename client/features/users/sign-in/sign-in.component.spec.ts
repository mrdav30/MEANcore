import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../utils';
import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  beforeEach(() => {
    const routerStub = { navigate: () => ({}) };
    const authServiceStub = {
      user: {},
      valuedateUser: () => ({ subscribe: () => ({}) }),
      signIn: () => ({ subscribe: () => ({}) }),
      redirectUrl: {}
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SignInComponent],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: AuthService, useValue: authServiceStub }
      ]
    });
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('isUserValidated defaults to: false', () => {
    expect(component.isUserValidated).toEqual(false);
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'redirectPostLogin');
      component.ngOnInit();
      expect(component.redirectPostLogin).toHaveBeenCalled();
    });
  });
  describe('validateUser', () => {
    it('makes expected calls', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      spyOn(authServiceStub, 'valuedateUser');
      component.validateUser();
      expect(authServiceStub.valuedateUser).toHaveBeenCalled();
    });
  });
  describe('signIn', () => {
    it('makes expected calls', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      spyOn(component, 'redirectPostLogin');
      spyOn(authServiceStub, 'signIn');
      component.signIn();
      expect(component.redirectPostLogin).toHaveBeenCalled();
      expect(authServiceStub.signIn).toHaveBeenCalled();
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
