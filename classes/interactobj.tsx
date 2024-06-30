import * as THREE from 'three';

type action_typ = "move" | "rotate" | "scale";

export class Interactobj {

    obj_id: number;
    id: number;
    action: action_typ; // This is the type of the action that we want for our object
    range: [number, number]; // Update the type of range to be an array of two numbers
    
   
    constructor(id: number, obj_id: number, action: action_typ, range: [number,number]) {
        this.id = id;
        this.obj_id = obj_id;   
        this.action = action;
        this.range = range;
    }
}
