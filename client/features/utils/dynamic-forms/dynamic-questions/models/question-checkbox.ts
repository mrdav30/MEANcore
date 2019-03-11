import { QuestionBase } from './question-base';

export class CheckboxQuestion extends QuestionBase<string> {
  controlType = 'checkbox';

  constructor(options: {} = {}) {
    super(options);
  }
}
