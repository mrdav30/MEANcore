import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from './models/question-base';

@Component({
  moduleId: module.id,
  selector: 'app-dynamic-question',
  templateUrl: 'dynamic-question.component.html',
  styleUrls: ['dynamic-question.component.css']
})
export class DynamicQuestionComponent {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  @Input() isNewObject: boolean;

  get isValid() {
    return this.form.controls[this.question.key].valid;
  }
}
