import { QuestionBase } from './question-base';

export class NumberQuestion extends QuestionBase<number> {
  controlType = 'number';

  constructor(options: {} = {}) {
    super(options);
  }
}
