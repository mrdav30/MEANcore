import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ScriptInjectorService } from '../features/utils';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(() => {
    const routerStub = { events: { pipe: () => ({ subscribe: () => ({}) }) } };
    const titleStub = { getTitle: () => ({}) };
    const scriptInjectorServiceStub = { load: () => ({ catch: () => ({}) }) };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AppComponent],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: Title, useValue: titleStub },
        { provide: ScriptInjectorService, useValue: scriptInjectorServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const titleStub: Title = fixture.debugElement.injector.get(Title);
      spyOn(titleStub, 'getTitle');
      component.ngOnInit();
      expect(titleStub.getTitle).toHaveBeenCalled();
    });
  });
});
