import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AuthService } from '../../utils';
import { SignUpComponent } from './sign-up.component';
import { AppHomeComponent } from '../../app-home/app-home.component';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let router: Router;

  beforeEach(() => {
    const changeDetectorRefStub = { detectChanges: () => ({}) };
    const authServiceStub = {
      signUp: () => ({ subscribe: () => ({}) }),
      user: false,
      redirectUrl: 'home'
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        SignUpComponent,
        AppHomeComponent
      ],
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: AppHomeComponent }
        ]),
      ],
      providers: [
        { provide: ChangeDetectorRef, useValue: changeDetectorRefStub },
        { provide: AuthService, useValue: authServiceStub }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.debugElement.componentInstance;
    router = TestBed.get(Router);

    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('onSubmit', () => {
    it('alerts when username already exists', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      spyOn(component, 'redirectPostLogin');
      spyOn(authServiceStub, 'signUp').and.callFake(() => {
        return of({
          userExists: true
        });
      });
      component.onSubmit();
      expect(authServiceStub.signUp).toHaveBeenCalled();
      expect(component.redirectPostLogin).not.toHaveBeenCalled();
    });
    it('logs in new user and redirects', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      spyOn(component, 'redirectPostLogin');
      spyOn(authServiceStub, 'signUp').and.callFake(() => {
        return of({
          userExists: false
        });
      });
      authServiceStub.user = true;
      component.onSubmit();
      expect(authServiceStub.signUp).toHaveBeenCalled();
      expect(component.redirectPostLogin).toHaveBeenCalled();
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
