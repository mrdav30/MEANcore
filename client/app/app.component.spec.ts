import { ComponentFixture, TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ApplicationInitStatus } from '@angular/core';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { APP_BASE_HREF } from '@angular/common';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          AppModule
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' }
        ]
      }).compileComponents();
    })
  );

  beforeEach(async () => {
    // until https://github.com/angular/angular/issues/24218 is fixed
    await TestBed.get(ApplicationInitStatus).donePromise;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;

    fixture.detectChanges();
  });

  it('should create a component', () => {
    expect(component).toBeTruthy();
  });

  it('should have current year', () => {
    expect(component.curYear).toBe(new Date().getFullYear());
  });
});
