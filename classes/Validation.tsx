export default abstract class Validation {
    is_valid: boolean;

    abstract computeValidity(obj: any): Validation;

    constructor({is_valid }: {
        is_valid: boolean;
    })
    {
        this.is_valid = is_valid;
    }

    get_isValid(): boolean {
        return this.is_valid;
    }

    set_valid(val: boolean): Validation { // for the store system
        if(this.is_valid == val) {
            return this
        }
        this.is_valid = val;
        return this.clone()
    }

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    
}