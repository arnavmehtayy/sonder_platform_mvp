import { Control } from "./Control";

export class InputNumber extends Control {
  value: number | "";
  placeholder: string;
  initial_value: number;
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

  setValue(value: number | "") {
    const new_obj = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this
    );
    new_obj.value = value;
    return new_obj;
  }
}
