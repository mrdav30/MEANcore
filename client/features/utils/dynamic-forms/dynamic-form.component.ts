import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { forEach, includes, chain } from 'lodash';

import { QuestionBase } from './dynamic-questions/models/question-base';
import { QuestionControlService } from './dynamic-questions/services/question-control.service';

@Component({
  moduleId: module.id,
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html',
  providers: [QuestionControlService]
})
export class DynamicFormComponent implements OnInit {
  @Input() object: any;
  @Input() questions: QuestionBase<any>[] = [];
  @Input() isReadOnly: boolean;
  @Input() isNewObject: boolean;
  @Output() closeForm = new EventEmitter();
  @Output() saveForm = new EventEmitter();
  form: FormGroup;
  payLoad = '';

  constructor(
    private questionControlService: QuestionControlService
  ) { }

  ngOnInit() {
    this.form = this.questionControlService.toFormGroup(this.questions);
  }

  onClose() {
    this.closeForm.emit(false);
  }

  onSubmit() {
    if (this.object) {
      const keys: any[] = Object.keys(this.form.value);

      forEach(keys, (key) => {
        if (includes(key, '.')) {
          const parts = chain(key)
            .split('.')
            .reverse()
            .value();
          let obj = this.form.value[key];
          forEach(parts, (part, index, array) => {
            if (index === array.length - 1) {
              this.object[part] = obj;
            } else {
              const newObj = {};
              newObj[part] = obj;
              obj = newObj;
            }
          });
        } else {
          this.object[key] = this.form.value[key];
        }
      });
    } else {
      this.object = this.form.value;
    }
    this.saveForm.emit(this.object);
  }
}
