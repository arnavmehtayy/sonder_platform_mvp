import {SelectControl} from "../Controls/SelectControl"
import Validation from "./Validation"


export default class Validation_select extends Validation {
    answer: number[]
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





}