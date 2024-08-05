import Validation from "./Validation";

export default class Validation_test extends Validation {
   constructor()  {
    super({is_valid: false, desc: "validation_test"})
   }

    computeValidity(): Validation_test {
        return this.set_valid(!this.is_valid) as Validation_test
    }
}