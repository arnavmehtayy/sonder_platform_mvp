import Validation, { ValidationConstructor } from "./Validation";

export default class Validation_test extends Validation {
  constructor({
    is_valid = false,
    desc = "validation_test",
  }: ValidationConstructor) {
    super({ is_valid: is_valid, desc: desc });
  }

  computeValidity(): Validation_test {
    return this.set_valid(!this.is_valid) as Validation_test;
  }

  dataBaseSave(): ValidationConstructor & {type: string} {
    return {
      is_valid: this.is_valid,
      desc: this.desc,
      type: 'Validation_test'
    };
  }
}
