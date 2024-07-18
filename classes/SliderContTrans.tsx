import {SliderControl } from './SliderControl';
import * as THREE from 'three';
import { TransformObj } from './transformObj';
import { obj } from './obj';
import * as att_funcs from "./attribute_funcs";

/*
 * This class stores the attributes of a transformation slider interaction in the scene.
 * The set_attribute is how anyone using this control should update the object.
 * The get_attribute is how anyone using this control should get the object's attribute.
 * This control only permits the control of one 'number' attribute of the object and strictly through the set_attribute and get_attribute functions.

*/


export type action_typ = "move" | "rotate" | "scale" | "path";
export type Parametric_curve = (t: number) => THREE.Vector2;

export class SlideContTrans<T extends TransformObj> extends SliderControl<T> {
  action: action_typ; // This is the type of the action that we want for our object
  param_curve: Parametric_curve; // This is the parametric curve that the control should follow


  constructor({
    id,
    obj_id,
    action,
    range,
    step_size = 1,
    param_curve = (t: number) =>
      new THREE.Vector2(5 * Math.sin(t), 5 * Math.cos(t)), // default to a line
  }: Partial<SlideContTrans<T>> & {
    id: number;
    obj_id: number;
    action: action_typ;
    range: [number, number];
  }) {
    super({ id: id, obj_id: obj_id, range: range, step_size: step_size })
    this.action = action;
    this.param_curve = param_curve;

    // Determine attribute functions based on the action type
    switch (this.action) {
      case "move":
        this.get_attribute = (obj: T) => att_funcs.get_position(obj).x;
        this.set_attribute = (obj: T, value: number) =>
          att_funcs.set_position(
            obj,
            new THREE.Vector2(value, att_funcs.get_position(obj).y)
          ) as T;
        break;
      case "rotate":
        this.get_attribute = (obj: T) => att_funcs.get_rotation(obj).z;
        this.set_attribute = (obj: T, value: number) => 
          att_funcs.set_rotation(
            obj,
            new THREE.Vector3(
              att_funcs.get_rotation(obj).x,
              att_funcs.get_rotation(obj).y,
              value
            )
          ) as T;
        break;
      case "scale":
        this.get_attribute = (obj: T) => att_funcs.get_scale(obj).x;
        this.set_attribute = (obj: T, value: number) =>
          att_funcs.set_scale(
            obj,
            new THREE.Vector3(
              value,
              att_funcs.get_scale(obj).y,
              att_funcs.get_scale(obj).z
            )
          ) as T;
        break;
      case "path": // rewrite this to use the parametric curve
        this.get_attribute = (obj: T) => (obj.param_t ? obj.param_t : 0);
        this.set_attribute = (obj: T, t: number) =>
          att_funcs.set_path_pos(obj, this.param_curve(t), t) as T;
        break;
    }
  }

}