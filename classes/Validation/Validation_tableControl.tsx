import { TableControl } from "../Controls/TableControl";
import Validation from "./Validation";
import * as val_func from "./Validation_funcs";
import { obj } from "../vizobjects/obj";

/*
 * Validation class for the TableControl
 * This class checks if the values in the table cells match the expected answers within a specified tolerance
*/
export class Validation_tableControl<T extends obj> extends Validation {
  answers: number[][];
  control_id: number; // control that we are validating
  error: number; // tolerance allowed for the answers
  validateCells: boolean[][]; // which cells to validate

  constructor({
    answers,
    control_id,
    desc = "validation_tableControl", // description of the validation that will show on the validation on the autograder
    error = 0.001,
    validateCells,
  }: Partial<Validation_tableControl<T>> & {
    answers: number[][];
    control_id: number;
    validateCells: boolean[][];
  }) {
    super({ is_valid: false, desc: desc });
    this.answers = answers;
    this.control_id = control_id;
    this.error = error;
    this.validateCells = validateCells;
  }

  // method to check if the values in the table cells match the expected answers within the specified tolerance
  // this is used by the storage system
  computeValidity(obj: TableControl<T>): Validation_tableControl<T> {
    let isValid = true;

    for (let i = 0; i < obj.rows.length; i++) {
      for (let j = 0; j < obj.rows[i].cells.length; j++) {
        if (this.validateCells[i][j]) {
          const cellValue = obj.rows[i].cells[j].value;
          const expectedValue = this.answers[i][j];

          if (!val_func.isEqual<number>(expectedValue, cellValue, this.error)) {
            isValid = false;
            break;
          }
        }
      }
      if (!isValid) break;
    }

    return this.set_valid(isValid) as Validation_tableControl<T>;
  }
}