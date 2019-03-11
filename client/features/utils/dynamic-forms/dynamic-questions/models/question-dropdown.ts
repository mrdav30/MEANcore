import { QuestionBase } from './question-base';

import * as _ from 'lodash';

export class DropdownQuestion extends QuestionBase<string> {
  controlType = 'dropdown';
  selectOptions: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.selectOptions = _.get(options, 'options') || [];
  }
}
