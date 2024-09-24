

import { InputNumber } from "../Controls/InputNumber";
import Validation from "./Validation";
import * as val_func from "./Validation_funcs";
import { ValidationConstructor } from "./Validation";


/*
 * Validation class for the InputNumber control
 * This class checks if the value of the input number is equal to the answer with some tolerance allowanc

*/

interface Validation_inputNumberConstructor extends ValidationConstructor {
  answer: number;
  control_id: number;
  error: number;
}
export class Validation_inputNumber extends Validation {
  answer: number;
  control_id: number; // control that we are validating
  error: number; // tolerance allowed for the answer

  constructor({
    answer,
    control_id,
    desc = "validation_inputNumber", // description of the validation that will show on the validation on the autograder
    error = 1,
  }: Partial<Validation_inputNumber> & {
    answer: number;
    control_id: number;
  }) {
    super({ is_valid: false, desc: desc });
    this.answer = answer;
    this.control_id = control_id;
    this.error = error;
  }


  // method to check if the value of the input number is equal to the answer with some tolerance
  // this is used by the storage system
  computeValidity(obj: InputNumber): Validation_inputNumber {
    if (
      obj.value !== "" &&
      val_func.isEqual<number>(this.answer, obj.value, this.error) 
    ) {
      return this.set_valid(true) as Validation_inputNumber;
    }
    return this.set_valid(false) as Validation_inputNumber;
  }

  dataBaseSave(): Validation_inputNumberConstructor & {type: string} {
    return {
      is_valid: this.is_valid,
      desc: this.desc,
      answer: this.answer,
      control_id: this.control_id,
      error: this.error,
      type: "Validation_inputNumber"
    };
  }
}
