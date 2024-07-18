/*
    This is the base class for every object in the scene.
*/

export class obj {
    id: number;

    constructor({id}: {id: number}) {   
        this.id = id;
    }
}