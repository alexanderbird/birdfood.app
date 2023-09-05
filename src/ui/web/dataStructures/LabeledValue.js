export class LabeledValue {
  constructor(label, value) {
    this.label = label;
    this.value = value;
  }

  static factory(labeller) {
    return value => new LabeledValue(labeller(value), value);
  }
}
