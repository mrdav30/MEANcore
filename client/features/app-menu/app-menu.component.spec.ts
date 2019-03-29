import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../utils';
import { ConfigService } from '../utils';
import { AppMenuComponent } from './app-menu.component';
import { environment } from '../../environments/environment';

describe('AppMenuComponent', () => {
  let component: AppMenuComponent;
  let fixture: ComponentFixture<AppMenuComponent>;
  beforeEach(() => {
    const routerStub = { navigate: () => ({}) };
    const authServiceStub = {
      userChange$: { subscribe: () => ({}) },
      user: {},
      signOut: () => ({})
    };
    const configServiceStub = { config: { menuConfig: {} } };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AppMenuComponent],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: ConfigService, useValue: configServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AppMenuComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('appHome defaults to: environment.appDefaultRoute', () => {
    expect(component.appHome).toEqual(environment.appDefaultRoute);
  });
  it('appLogo defaults to: environment.appLogo', () => {
    expect(component.appLogo).toEqual(environment.appLogo);
  });
  it('visibleMenus defaults to: []', () => {
    expect(component.visibleMenus).toEqual([]);
  });
  it('showLoginNav defaults to: true', () => {
    expect(component.showLoginNav).toEqual(true);
  });
  it('showSearchNav defaults to: true', () => {
    expect(component.showSearchNav).toEqual(true);
  });
  it('isSearchVisible defaults to: false', () => {
    expect(component.isSearchVisible).toEqual(false);
  });
  it('isNavbarCollapsed defaults to: true', () => {
    expect(component.isNavbarCollapsed).toEqual(true);
  });
  it('user defaults to: false', () => {
    expect(component.user).toEqual(false);
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'onSetUser');
      spyOn(component, 'onResize');
      component.ngOnInit();
      expect(component.onSetUser).toHaveBeenCalled();
      expect(component.onResize).toHaveBeenCalled();
    });
  });
  describe('onSubmit', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, 'navigate');
      component.onSubmit();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
  describe('logout', () => {
    it('makes expected calls', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      spyOn(authServiceStub, 'signOut');
      component.logout();
      expect(authServiceStub.signOut).toHaveBeenCalled();
    });
  });
});
