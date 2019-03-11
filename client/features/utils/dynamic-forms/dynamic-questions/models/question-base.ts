export class QuestionBase<T> {
  value: T;
  key: string;
  label: string;
  createLabel: string;
  required: boolean;
  order: number;
  controlType: string;
  disabled: boolean;
  hideOnCreate: boolean;
  hideOnEdit: boolean;
  constructor(options: {
    value?: T,
    key?: string,
    label?: string,
    createLabel?: string,
    required?: boolean,
    order?: number,
    controlType?: string,
    disabled?: boolean,
    hideOnCreate?: boolean,
    hideOnEdit?: boolean
  } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.createLabel = options.createLabel || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.disabled = !!options.disabled;
    this.hideOnCreate = options.hideOnCreate || false;
    this.hideOnEdit = options.hideOnEdit || false;
  }
}
