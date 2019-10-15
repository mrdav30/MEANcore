import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ElementRef } from '@angular/core';
import { AnimatedLabelDirective } from './animated-label.directive';

@Component({
  template: `
  <div>
    <label for="without">Without Directive</label>
    <input id="without" type="text" value=""/>
  </div>
  <div>
    <label for="with">With Directive</label>
    <input id="with" type="text" appAnimatedLabel/>
  </div>
  `
})
class TestComponent { }

describe('AnimatedLabelDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let elementWithDirective: DebugElement;
  let bareElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AnimatedLabelDirective,
        TestComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.debugElement.componentInstance;

    fixture.detectChanges();

    elementWithDirective = fixture.debugElement.query(
      By.directive(AnimatedLabelDirective)
    );
    bareElement = fixture.debugElement.query(
      By.css(':not([appAnimatedLabel])')
    );
  });

  it('should have bare element', () => {
    expect(bareElement).toBeTruthy();
  });
  it('should have 1 element(s) with directive', () => {
    expect(elementWithDirective).toBeTruthy();
  });
  it('should add animated label class on focus', () => {
    elementWithDirective.nativeElement.triggerEventHandler('focus', null);
    fixture.detectChanges();
    expect(elementWithDirective.parent.nativeElement.classes).toContain('animated-label-focus');
  });
  // describe('ngOnInit', () => {
  //   it('makes expected calls', () => {
  //     spyOn(component, 'setup');
  //     pipe.ngOnInit();
  //     expect(pipe.setup).toHaveBeenCalled();
  //   });
  // });
});
