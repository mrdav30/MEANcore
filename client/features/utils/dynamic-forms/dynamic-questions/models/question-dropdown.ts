import { QuestionBase } from './question-base';

import { get } from 'lodash';

export class DropdownQuestion extends QuestionBase<string> {
  controlType = 'dropdown';
  selectOptions: { key: string, value: string }[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.selectOptions = get(options, 'options') || [];
  }
}
