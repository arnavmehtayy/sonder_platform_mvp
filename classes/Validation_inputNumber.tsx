import { InputNumber } from "./InputNumber";
import Validation from "./Validation";
import * as val_func from "./Validation_funcs";

export class Validation_inputNumber extends Validation {
    answer: number
    control_id: number
    error: number

    constructor({
        answer,
        control_id,
        desc = "validation_inputNumber",
        error = 1
    }: Partial<Validation_inputNumber> & {
        
        answer: number,
        control_id: number
    }) {
        super({ is_valid: false , desc: desc})
        this.answer = answer
        this.control_id = control_id
        this.error = error
    }

    computeValidity(obj: InputNumber): Validation_inputNumber {
        if (obj.value !== '' && val_func.isEqual<number>(this.answer, obj.value, this.error)) {
            return this.set_valid(true) as Validation_inputNumber
        }
        return this.set_valid(false) as Validation_inputNumber
    }





}