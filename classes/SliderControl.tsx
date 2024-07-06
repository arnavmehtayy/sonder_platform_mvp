import * as THREE from "three";
import { vizobj } from "./vizobj";
import * as att_funcs from "./attribute_funcs";

/*
 * This class stores the attributes of a user control interaction in the scene.
 * The set_attribute is how anyone using this control should update the object.
 * The get_attribute is how anyone using this control should get the object's attribute.
 * This control only permits the control of one attribute of the object and strictly through the set_attribute and get_attribute functions.


*/

export type action_typ = "move" | "rotate" | "scale";

export class SliderControl {
  obj_id: number; // This is the id of the object that we want to control
  id: number; // This is the id of the control
  action: action_typ; // This is the type of the action that we want for our object
  range: [number, number]; // This is the range of the control
  step_size: number; // This is the step size of the control
  get_attribute: (obj: vizobj) => number; // Function to get the attribute of the object
  set_attribute: (obj: vizobj, value: number) => vizobj; // Function to set the attribute of the object

  constructor({
    id,
    obj_id,
    action,
    range,
    step_size = 1
  }: Partial<SliderControl> & { id: number; obj_id: number; action: action_typ; range: [number, number] }) {
    this.id = id;
    this.obj_id = obj_id;
    this.action = action;
    this.range = range;
    this.step_size = step_size;

    // Determine attribute functions based on the action type
    switch (this.action) {
      case "move":
        this.get_attribute = (obj: vizobj) => att_funcs.get_position(obj).x;
        this.set_attribute = (obj: vizobj, value: number) =>
          att_funcs.set_position(obj, new THREE.Vector2(value, att_funcs.get_position(obj).y));
        break;
      case "rotate":
        this.get_attribute = (obj: vizobj) => att_funcs.get_rotation(obj).z;
        this.set_attribute = (obj: vizobj, value: number) =>
          att_funcs.set_rotation(obj, new THREE.Vector3(att_funcs.get_rotation(obj).x, att_funcs.get_rotation(obj).y, value));
        break;
      case "scale":
        this.get_attribute = (obj: vizobj) => att_funcs.get_scale(obj).x;
        this.set_attribute = (obj: vizobj, value: number) =>
          att_funcs.set_scale(obj, new THREE.Vector3(value, att_funcs.get_scale(obj).y, att_funcs.get_scale(obj).z));
        break;
    }
  }
}
