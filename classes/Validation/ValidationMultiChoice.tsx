import { MultiChoiceClass } from "../Controls/MultiChoiceClass";
import Validation, { ValidationConstructor } from "./Validation";


/*
* Validation class for the MultiChoice control
* This class checks if the selected choices are equal to the answer choices
*/

interface ValidationMultiChoiceConstructor extends ValidationConstructor {
    answer: number[];
    control_id: number;
}

export class ValidationMultiChoice extends Validation {
    answer : number[] // the list of objects that should be selected as the MCQ choices
    control_id : number

    constructor({
        answer,
        control_id,
        desc = "validation_select"
    }: ValidationMultiChoiceConstructor) {
        super({ is_valid: false , desc: desc})
        this.answer = answer
        this.control_id = control_id
    }

    // method to check if the selected choices are equal to the answer choices
    // this is used by the storage system
    computeValidity(obj: MultiChoiceClass): ValidationMultiChoice {
        if (this.answer.length === obj.selectedOptions.length) {
            for (let i = 0; i < this.answer.length; i++) {
                if (!obj.selectedOptions.includes(this.answer[i])) {
                    return this.set_valid(false) as ValidationMultiChoice
                }
            }
            return this.set_valid(true) as ValidationMultiChoice
        }
        return this.set_valid(false) as ValidationMultiChoice
    }

    dataBaseSave(): ValidationMultiChoiceConstructor & {type:string} {
        return {
            is_valid: this.is_valid,
            desc: this.desc,
            answer: this.answer,
            control_id: this.control_id,
            type: 'ValidationMultiChoice'
        }
    }






}