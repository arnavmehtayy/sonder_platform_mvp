import { Control } from "./Control";
export class EnablerControl extends Control {
  obj_ids: number[];
  ControlState: boolean;
  constructor({
    control_id,
    desc = "control_Enabler",
    text = "this is a description of an enabler control",
    obj_ids,
  }: Partial<EnablerControl> & {
    control_id: number;
    obj_ids: number[];
  }) {
    super({ id: control_id, desc: desc, text: text });
    this.obj_ids = obj_ids;
    this.ControlState = false; // objects start of invisible
  }
  setControlState(state: boolean) {
    const newControl = Object.assign( Object.create(Object.getPrototypeOf(this)), this);
    newControl.ControlState = state;
    return newControl;
  }
}
