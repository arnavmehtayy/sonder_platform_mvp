import * as THREE from 'three';

type action_typ = "move" | "rotate" | "scale";

export class Interactobj {

    action: action_typ; // This is the type of the action that we want for our object
    range: [number, number]; // Update the type of range to be an array of two numbers
    value: number = 0; // This is the initial position of the object
    
   
    constructor(action: action_typ, range: [number,number], initial: number = 0) {
        this.action = action;
        this.range = range;
        this.value = initial;
    }
}
