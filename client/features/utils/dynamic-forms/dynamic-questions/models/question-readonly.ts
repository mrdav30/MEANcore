import { QuestionBase } from './question-base';

export class ReadonlyField extends QuestionBase<string> {
  controlType = 'readonly';

  constructor(options: {} = {}) {
    super(options);
  }
}
