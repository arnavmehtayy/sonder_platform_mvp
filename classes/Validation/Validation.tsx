import { is } from "@react-three/fiber/dist/declarations/src/core/utils";
import { obj } from "../vizobjects/obj";

/*
 * This is the parent class for all the Validation classes

*/

export type Validation_types = "V_input" | "V_obj" | "V_score" | "V_slider" | "V_select" | "V_test" 
 | "V_table" | "V_numberIn" | "V_MCQ"| "V" // for database to store which class to reconstruct

export interface ValidationConstructor {
  is_valid?: boolean;
  desc: string;
  type?: Validation_types
}

export default abstract class Validation {
  desc: string; // description of the validation that will show on the validation on the autograder
  is_valid: boolean; // this is the boolean that tells if the validation is valid or not

  // every validator must have a method to compute the validity of the object
  abstract computeValidity(obj: any | obj[]): Validation; 

  

  // abstract dataBaseSave(): ValidationConstructor & {type: string};

  dataBaseSave(): ValidationConstructor {
    return {
      is_valid: this.is_valid,
      desc: this.desc,
      type: "V" // This will give us the name of the specific Validation subclass
    };
  }

  constructor({
    is_valid,
    desc = "validation",
  }: ValidationConstructor) {
    this.is_valid = is_valid || false;
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
