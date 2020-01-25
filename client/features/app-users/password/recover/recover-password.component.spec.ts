import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AuthService } from '../../../utils';
import { RecoverPasswordComponent } from './recover-password.component';
import { AppHomeComponent } from '../../../app-home/app-home.component';

describe('RecoverPasswordComponent', () => {
  let component: RecoverPasswordComponent;
  let fixture: ComponentFixture<RecoverPasswordComponent>;
  let router: Router;

  beforeEach(
    async(() => {
      const authServiceStub = {
        signIn: () => ({ subscribe: () => ({}) }),
        forgot: () => ({ subscribe: () => ({}) }),
        user: false,
        redirectUrl: 'home'
      };
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [
          RecoverPasswordComponent,
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
    }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoverPasswordComponent);
    component = fixture.debugElement.componentInstance;
    router = TestBed.get(Router);

    component.user.usernameOrEmail = 'test@test.com';

    fixture.detectChanges();
  });

  it('should create a component', () => {
    expect(component).toBeTruthy();
  });
  it('isSecretValidated defaults to: false', () => {
    expect(component.isSecretValidated).toEqual(false);
  });
  it('isSecretReset defaults to: false', () => {
    expect(component.isSecretReset).toEqual(false);
  });
  describe('recoverPassword', () => {
    it('signs in when correct password entered', () => {
      component.user.password = 'secret';
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      spyOn(authServiceStub, 'signIn').and.callFake(() => {
        return of(true);
      });
      authServiceStub.user = true;
      component.recoverPassword();
      expect(authServiceStub.signIn).toHaveBeenCalled();
      expect(component.isSecretValidated).toEqual(true);
    });
    it('alerts user that a recovery email was sent', () => {
      component.user.password = 'secret';
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      spyOn(authServiceStub, 'signIn').and.callFake(() => {
        return of({ invalidSecret: true });
      });
      spyOn(authServiceStub, 'forgot').and.callFake(() => {
        return of({ isSecretReset: true });
      });
      authServiceStub.user = false;
      component.recoverPassword();
      expect(authServiceStub.signIn).toHaveBeenCalled();
      expect(authServiceStub.forgot).toHaveBeenCalled();
      expect(component.isSecretReset).toEqual(true);
    });
  });
  describe('redirectPostLogin', () => {
    it('makes expected calls', () => {
      const navigateSpy = spyOn(router, 'navigate');

      component.redirectPostLogin();
      expect(navigateSpy).toHaveBeenCalledWith(['home']);
    });
  });
});
