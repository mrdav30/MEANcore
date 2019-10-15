import { ComponentFixture, TestBed, async, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ApplicationInitStatus, Component } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { ScriptInjectorService } from 'features/utils';

// create dummy search component
@Component({
  template: `Test`
})
export class TestNavigationComponent {
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  let router: Router;
  let scriptInjectorServiceSpy: ScriptInjectorService;

  beforeEach(
    async(() => {
      const titleStub = { getTitle: () => ({}) };
      scriptInjectorServiceSpy = jasmine.createSpyObj('ScriptInjectorService', {
        load: new Promise((resolve) => { resolve(); })
      });

      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [AppComponent, TestNavigationComponent],
        imports: [
          RouterTestingModule.withRoutes([
            { path: 'test', component: TestNavigationComponent }
          ])
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: Title, useValue: titleStub },
          { provide: ScriptInjectorService, useValue: scriptInjectorServiceSpy }
        ]
      }).compileComponents();
    })
  );

  // beforeEach(async () => {
  //   // until https://github.com/angular/angular/issues/24218 is fixed
  //   await TestBed.get(ApplicationInitStatus).donePromise;
  // });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    router = TestBed.get(Router);

    fixture.detectChanges();
  });

  it('should create a component', () => {
    expect(component).toBeTruthy();
  });

  it('should have current year', () => {
    expect(component.curYear).toBe(new Date().getFullYear());
  });

  it('should load gtag script', fakeAsync(() => {
    expect(scriptInjectorServiceSpy.load).toHaveBeenCalledWith('gtag');
  }));

  describe('ngOnInit', () => {
    beforeEach((done) => {
      // inject gtag script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = '../assets/js/gtag.js';
      document.getElementsByTagName('head')[0].appendChild(script);
      setTimeout(() => {
        done();
      }, 1000);
    });

    it('should call gtag on page navigation', async() => {
      const titleStub: Title = fixture.debugElement.injector.get(Title);
      spyOn(titleStub, 'getTitle');

      component.ngOnInit();
      await fixture.ngZone.run(async () => {
        await router.navigate(['/test']);
      });

      expect(titleStub.getTitle).toHaveBeenCalled();
    });
  });
});
