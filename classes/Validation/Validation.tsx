import { obj } from "../vizobjects/obj";

/*
 * This is the parent class for all the Validation classes

*/
export default abstract class Validation {
  desc: string; // description of the validation that will show on the validation on the autograder
  is_valid: boolean; // this is the boolean that tells if the validation is valid or not

  // every validator must have a method to compute the validity of the object
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

  // for the store system
  set_valid(val: boolean): Validation {
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
