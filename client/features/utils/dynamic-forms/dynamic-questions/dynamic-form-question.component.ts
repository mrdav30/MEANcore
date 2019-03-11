import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from './models/question-base';

@Component({
  moduleId: module.id,
  selector: 'app-dynamic-form-question',
  templateUrl: 'dynamic-form-question.component.html',
  styleUrls: ['dynamic-form-question.component.css']
})
export class DynamicFormQuestionComponent {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  @Input() isNewObject: boolean;

  get isValid() {
    return this.form.controls[this.question.key].valid;
  }
}
