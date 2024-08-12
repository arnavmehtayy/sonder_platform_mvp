import { MultiChoiceClass } from "../Controls/MultiChoiceClass";
import Validation from "./Validation";

export class ValidationMultiChoice extends Validation {
    answer : number[]
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