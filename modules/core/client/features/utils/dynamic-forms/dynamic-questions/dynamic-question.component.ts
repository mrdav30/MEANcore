import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from './models/question-base';

@Component({
  moduleId: module.id,
  selector: 'app-dynamic-question',
  templateUrl: 'dynamic-question.component.html'
})
export class DynamicQuestionComponent {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  @Input() isNewObject: boolean;

  get isValid(): boolean {
    if (this.question.required) {
      if (this.form.controls[this.question.key].untouched) {
        return true;
      } else if (this.form.controls[this.question.key].value && this.form.controls[this.question.key].valid) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}
