import {SelectControl} from "../Controls/SelectControl"
import Validation from "./Validation"
import {ValidationConstructor} from "./Validation"

/* 
* Validation class for the Select control
* This class checks if the selected objects are equal to the answer objects
* attributes of this class are: answer, control_id
*/

interface Validation_selectConstructor extends ValidationConstructor {
    answer: number[];
    control_id: number;
}

export default class Validation_select extends Validation {
    answer: number[] // the list of objects that should be selected
    control_id: number 

    constructor({
        answer,
        control_id,
        desc = "validation_select"
    }: Partial<Validation_select> & {
        
        answer: number[],
        control_id: number
    }) {
        super({ is_valid: false , desc: desc})
        this.answer = answer
        this.control_id = control_id
    }

    // method to check if the selected objects are equal to the answer objects
    // this is used by the storage system
    computeValidity(obj: SelectControl): Validation_select {
        if (this.answer.length === obj.selected.length) {
            for (let i = 0; i < this.answer.length; i++) {
                if (!obj.selected.includes(this.answer[i])) {
                    return this.set_valid(false) as Validation_select
                }
            }
            return this.set_valid(true) as Validation_select
        }
        return this.set_valid(false) as Validation_select
    }

    dataBaseSave(): Validation_selectConstructor & {type: string} {
        return {
            is_valid: this.is_valid,
            desc: this.desc,
            answer: this.answer,
            control_id: this.control_id,
            type: "Validation_select"
        }
    }





}