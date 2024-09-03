import { MultiChoiceClass } from "../Controls/MultiChoiceClass";
import Validation from "./Validation";


/*
* Validation class for the MultiChoice control
* This class checks if the selected choices are equal to the answer choices
*/

export class ValidationMultiChoice extends Validation {
    answer : number[] // the list of objects that should be selected as the MCQ choices
    control_id : number

    constructor({
        answer,
        control_id,
        desc = "validation_select"
    }: Partial<ValidationMultiChoice> & {
        
        answer: number[],
        control_id: number
    }) {
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






}