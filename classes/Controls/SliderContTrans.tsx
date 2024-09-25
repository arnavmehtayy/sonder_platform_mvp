

import { SliderControl, SliderControlConstructor } from "./SliderControl";
import * as THREE from "three";
import { TransformObj } from "../vizobjects/transformObj";
import { obj } from "../vizobjects/obj";
import * as att_funcs from "../attribute_funcs";
import React from "react";
import Latex from "react-latex-next";
import { useStore, setSliderControlValueSelector, getSliderControlValueSelector } from "@/app/store";
import {ShowSliderControl } from "./SliderControl";

/*
 * This class stores information about a slider that will be used to move-x axis, rotate-z axis, scale-x axis or move an object along some parametric path.
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
      new THREE.Vector2(5 * Math.sin(t), 5 * Math.cos(t)), // default to a circle path
    desc = "slider control trans",
    text = "this is a slider control trans",
  }: SlideContTrans<T>) {
    super({
      id: id,
      obj_id: obj_id,
      range: range,
      step_size: step_size,
      desc: desc,
      text: text,
    });
    this.action = action;
    this.param_curve = param_curve;

    // Determine attribute functions based on the action type
    switch (this.action) {
      case "move": // move along the x-axis
        this.get_attribute = (obj: T) => att_funcs.get_position(obj).x;
        this.set_attribute = (obj: T, value: number) =>
          att_funcs.set_position(
            obj,
            new THREE.Vector2(value, att_funcs.get_position(obj).y)
          ) as T;
        break;
      case "rotate": // rotate about the z-axis
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
      case "scale": // scale along the x-axis
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
      case "path": // move along the parametric path
        this.get_attribute = (obj: T) => (obj.param_t ? obj.param_t : 0);
        this.set_attribute = (obj: T, t: number) =>
          att_funcs.set_path_pos(obj, this.param_curve(t), t) as T;
        break;
    }
  }

  dataBaseSave(): SliderControlConstructor<T> & {type: string} {
    return {
      id: this.id,
      obj_id: this.obj_id,
      range: this.range,
      step_size: this.step_size,
      desc: this.desc,
      text: this.text,
      type: "SliderContTrans"
    };
  }

  // method to render the slider control onto the sidebar
  render(): React.ReactNode {
    return <ShowSliderControl control={this} />;
    // const setValue = useStore(setSliderControlValueSelector(this.id));
    // const getValue = useStore(getSliderControlValueSelector(this.id));

    // return (
    //   <div className={`bg-white rounded-lg shadow-md p-4 ${!this.isClickable ? "opacity-50" : ""} relative`}>
    //     <h3 className="text-lg font-semibold text-blue-800 mb-2">
    //       <Latex>{this.desc}</Latex>
    //     </h3>
    //     <p className="text-gray-600 mb-2">
    //       <Latex>{this.text}</Latex>
    //     </p>
    //     <div className="relative pt-1">
    //       <input
    //         type="range"
    //         min={this.range[0]}
    //         max={this.range[1]}
    //         step={this.step_size}
    //         value={getValue}
    //         onChange={(e) => setValue(Number(e.target.value))}
    //         className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
    //         disabled={!this.isClickable}
    //       />
    //       <div className="flex justify-between items-center mt-2">
    //         <span className="text-sm text-gray-600">{this.range[0]}</span>
    //         <span className="text-sm font-medium text-blue-600">
    //           {getValue.toFixed(2)}
    //         </span>
    //         <span className="text-sm text-gray-600">{this.range[1]}</span>
    //       </div>
    //     </div>
    //   </div>
    // );
  }
}
