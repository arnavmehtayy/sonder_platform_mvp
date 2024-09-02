import { Control } from "./Control";

/*

 *  This is the class that holds information about the input number control
  *  The input number control is used to input a number into a text box
  * the attributes of this class are: value, placeholder, initial_value, min, max, step

*/


export class InputNumber extends Control {
  value: number | ""; // the value of the input number in the box
  placeholder: string; // the text that appears in the box when no value is entered
  initial_value: number; // the initial value of the input number for when the arrows are toggled initially
  min: number;
  max: number;
  step: number;

  constructor({
    control_id,
    value = 0,
    desc = "input a number",
    text = "here you need to input a number",
    placeholder = "number",
    initial_value = 0,
    min = 0,
    max = 100,
    step = 1,
  }: Partial<InputNumber> & {
    value: number;
    control_id: number;
  }) {
    super({ id: control_id, desc: desc, text: text });
    this.value = value;
    this.placeholder = placeholder;
    this.initial_value = initial_value;
    this.min = min;
    this.max = max;
    this.step = step;
  }

  // change the value of the input number used by the storage system
  setValue(value: number | "") { 
    const new_obj = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this
    );
    new_obj.value = value;
    return new_obj;
  }
}
