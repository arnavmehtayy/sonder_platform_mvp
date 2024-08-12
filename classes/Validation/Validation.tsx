import { obj } from "../vizobjects/obj";

export default abstract class Validation {
  desc: string;
  is_valid: boolean;

  abstract computeValidity(obj: any | obj[]): Validation;

  constructor({
    is_valid,
    desc = "validation",
  }: Partial<Validation> & {
    is_valid: boolean;
    desc: string;
  }) {
    this.is_valid = is_valid;
    this.desc = desc;
  }

  get_isValid(): boolean {
    return this.is_valid;
  }

  set_valid(val: boolean): Validation {
    // for the store system
    if (this.is_valid == val) {
      return this;
    }
    this.is_valid = val;
    return this.clone();
  }

  clone() {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}
