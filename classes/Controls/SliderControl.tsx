import { obj } from "../vizobjects/obj";
import { Control } from "./Control";

/*
 *  This is the class that holds information about the slider control
  *  The slider control is used to change the value of an attribute of an object using a number slider
  * the attributes of this class are: 
  * obj_id (object who the control is controlling)
  * range, step_size, 
  * get_attribute (function to get the attribute of the object that the control is controlling),
  * set_attribute (function to set the attribute of the object that the control is controlling)

*/
// This class is the base class used to create a slider control for any object in the scene

export class SliderControl<T extends obj> extends Control {
  obj_id: number; // This is the id of the object that the control is controlling
  range: [number, number];
  step_size: number;
  get_attribute: (obj: T) => number; // Function to get the attribute of the object
  set_attribute: (obj: T, value: number) => T; // Function to set the attribute of the object
  constructor({
    id,
    obj_id,
    range,
    step_size = 1,
    get_attribute = (obj: T) => {
      console.log("default SliderControl");
      return 0;
    },
    set_attribute = (obj: T, value: number) => {
      console.log("default SliderControl");
      return obj;
    },
    desc = "slider control",
    text = "this is a slider control",
  }: Partial<SliderControl<T>> & {
    id: number;
    obj_id: number;
    range: [number, number];
  }) {
    super({ id: id, desc, text: text });
    this.obj_id = obj_id;
    this.range = range;
    this.step_size = step_size;
    this.get_attribute = get_attribute;
    this.set_attribute = set_attribute;
  }

  // method to get the value of the slider control given the instance of the object that the control is controlling
  getSliderValue(obj: T): number { 
    if (obj) {
      return this.get_attribute(obj as T);
    } else {
      return 0;
    }
  }

  // method that returns a new object of the controller object with the attribute set to the relevant value
  setSliderValue(obj: T, value: number): T {
    if (obj) {
      return this.set_attribute(obj as T, value);
    } else {
      return obj;
    }
  }
}
