import * as THREE from 'three';
import { vizobj } from './vizobj';
import * as att_funcs from './attribute_funcs';

export type action_typ = "move" | "rotate" | "scale";


export class Interactobj {

    obj_id: number;
    id: number;
    action: action_typ; // This is the type of the action that we want for our object
    range: [number, number]; // Update the type of range to be an array of two numbers
    step_size: number = 1; // Add a step size to the object
    get_attribute: (obj: vizobj) => number ; // Add a function to get the attribute of the object
    set_attribute: (obj: vizobj, value: number) => void; // Add a function to set the attribute of the object
    
   
    constructor(options: { id: number, obj_id: number, action: action_typ, range: [number, number], step_size?: number }) {
        this.id = options.id;
        this.obj_id = options.obj_id;
        this.action = options.action;
        this.range = options.range;
        this.step_size = options.step_size ?? 1;
        switch(this.action) {
            case "move":
                this.get_attribute = (obj: vizobj) => att_funcs.get_position(obj).x;
                this.set_attribute = (obj: vizobj, value: number) => att_funcs.set_position(obj, new THREE.Vector2(value, att_funcs.get_position(obj).y));
                break;
            case "rotate":
                this.get_attribute = (obj: vizobj) => att_funcs.get_rotation(obj).z;
                this.set_attribute = (obj: vizobj, value: number) => att_funcs.set_rotation(obj, new THREE.Vector3(att_funcs.get_rotation(obj).x, att_funcs.get_rotation(obj).y, value));
                break;
            case "scale":
                this.get_attribute = (obj: vizobj) =>  att_funcs.get_scale(obj).x;
                this.set_attribute = (obj: vizobj, value: number) => att_funcs.set_scale(obj, new THREE.Vector3(value, att_funcs.get_scale(obj).y, att_funcs.get_scale(obj).z));
                break;
        }
    }

}
