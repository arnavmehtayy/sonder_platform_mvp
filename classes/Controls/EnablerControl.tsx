import { Control } from "./Control";

/*

 * This is the class that holds information about the enabler control
 * The enabler control is used to enable or disable vizobject on the screen
 * the attributes of this class are: obj_ids, ControlState

*/

export class EnablerControl extends Control {
  obj_ids: number[]; // vizobjects that this enabler can enable or disable
  ControlState: boolean; // the current enabled/disabled state of the enabler
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

  // change the enabled/disabled state of the enabler control used by the storage system
  setControlState(state: boolean) { 
    const newControl = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this
    );
    newControl.ControlState = state;
    return newControl;
  }
}
