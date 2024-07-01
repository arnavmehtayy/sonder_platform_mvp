import * as THREE from 'three';

export type action_typ = "move" | "rotate" | "scale";

export class Interactobj {

    obj_id: number;
    id: number;
    action: action_typ; // This is the type of the action that we want for our object
    range: [number, number]; // Update the type of range to be an array of two numbers
    step_size: number = 1; // Add a step size to the object
    
   
    constructor(options: { id: number, obj_id: number, action: action_typ, range: [number, number], step_size?: number }) {
        this.id = options.id;
        this.obj_id = options.obj_id;
        this.action = options.action;
        this.range = options.range;
        this.step_size = options.step_size ?? 1;
    }

}
