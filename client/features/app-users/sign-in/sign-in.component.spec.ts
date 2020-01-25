import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AuthService } from '../../utils';
import { SignInComponent } from './sign-in.component';
import { AppHomeComponent } from '../../app-home/app-home.component';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let router: Router;

  beforeEach(() => {
    const authServiceStub = {
      user: false,
      validateUser: () => ({ subscribe: () => ({}) }),
      signIn: () => ({ subscribe: () => ({}) }),
      redirectUrl: 'home'
    };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        SignInComponent,
        AppHomeComponent
      ],
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: AppHomeComponent }
        ]),
      ],
      providers: [
        { provide: AuthService, useValue: authServiceStub }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.debugElement.componentInstance;
    router = TestBed.get(Router);

    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('isUserValidated defaults to: false', () => {
    expect(component.isUserValidated).toEqual(false);
  });
  describe('ngOnInit', () => {
    it('redirects if user already logged on', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      authServiceStub.user = true;
      spyOn(component, 'redirectPostLogin');
      component.ngOnInit();
      expect(component.redirectPostLogin).toHaveBeenCalled();
    });
  });
  describe('validateUser', () => {
    it('ensures username exists', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      spyOn(authServiceStub, 'validateUser').and.callFake(() => {
        return of({
          userExists: true
        });
      });
      component.validateUser();
      expect(authServiceStub.validateUser).toHaveBeenCalled();
      expect(component.isUserValidated).toEqual(true);
    });
  });
  describe('signIn', () => {
    it('makes expected calls', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      spyOn(component, 'redirectPostLogin');
      spyOn(authServiceStub, 'signIn').and.callFake(() => {
        return of({
          invalidSecret: false
        });
      });
      authServiceStub.user = true;
      component.signIn();
      expect(authServiceStub.signIn).toHaveBeenCalled();
      expect(component.redirectPostLogin).toHaveBeenCalled();
    });
  });
  describe('redirectPostLogin', () => {
    it('navigates to default route', () => {
      const navigateSpy = spyOn(router, 'navigate');

      component.redirectPostLogin();
      expect(navigateSpy).toHaveBeenCalledWith(['home']);
    });
  });
});
