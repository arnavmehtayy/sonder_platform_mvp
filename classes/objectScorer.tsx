import { obj } from "./obj";

export class objectScorer<obj_T extends obj > {
    id: number;
    get_attribute: (obj: obj_T) => number;

    constructor({
        id,
        get_attribute,
    }: {
        id: number;
        get_attribute: (obj: obj_T) => number;
    }) {
        this.id = id;
        this.get_attribute = get_attribute;
    }
}