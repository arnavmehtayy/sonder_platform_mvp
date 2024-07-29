import Validation from "./Validation";

export default class Validation_test extends Validation {
   constructor()  {
    super({is_valid: false})
   }

    computeValidity(): Validation_test {
        this.is_valid = !this.is_valid
        return this
    }
}