import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../../environments/environment';

import { AuthService } from '../utils';
import { ConfigService } from '../utils';
import { AppMenuComponent } from './app-menu.component';

// create dummy search component
@Component({
  template: `Search`
})
export class SearchComponent {
}

describe('AppMenuComponent', () => {
  let component: AppMenuComponent;
  let fixture: ComponentFixture<AppMenuComponent>;
  let router: Router;

  beforeEach(
    async(() => {
      const authServiceStub = {
        userChange$: { subscribe: () => ({}) },
        user: false,
        signOut: () => ({})
      };
      const configServiceStub = { config: { menuConfig: {} } };

      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [
          AppMenuComponent,
          SearchComponent
        ],
        imports: [
          FormsModule,
          RouterTestingModule.withRoutes([
            { path: 'search', component: SearchComponent }
          ]),
          NgbCollapseModule
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: AuthService, useValue: authServiceStub },
          { provide: ConfigService, useValue: configServiceStub }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AppMenuComponent);
    component = fixture.debugElement.componentInstance;
    router = TestBed.get(Router);

    fixture.detectChanges();
  });

  it('should create a component', () => {
    expect(component).toBeTruthy();
  });

  it('appHome defaults to: environment.appDefaultRoute', () => {
    expect(component.appDefaultRoute).toEqual(environment.appDefaultRoute);
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
    expect(component.currentUser).toEqual(false);
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
      component.appSearchRoute = '/search';
      component.searchQuery = '';
      const navigateSpy = spyOn(router, 'navigate');

      component.onSubmit();
      expect(navigateSpy).toHaveBeenCalledWith(['/search', '']);
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
