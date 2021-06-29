import { QuestionBase } from './question-base';

export class TextareaQuestion extends QuestionBase<string> {
  controlType = 'textarea';

  constructor(options: {} = {}) {
    super(options);
  }
}
