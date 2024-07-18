import { obj } from "./obj";

// This class is the base class used to create a slider control for any object in the scene

export class SliderControl<T extends obj> {
  obj_id: number; // This is the id of the object that we want to control
  id: number; // This is the id of the control
  range: [number, number]; // This is the range of the control
  step_size: number; // This is the step size of the control
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
  }: Partial<SliderControl<T>> & {
    id: number;
    obj_id: number;
    range: [number, number];
  }) {
    this.id = id;
    this.obj_id = obj_id;
    this.range = range;
    this.step_size = step_size;
    this.get_attribute = get_attribute;
    this.set_attribute = set_attribute

  }
}
