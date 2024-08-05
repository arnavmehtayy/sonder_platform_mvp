import { Control } from "./Control";
import { obj } from "./obj";

export class SelectControl extends Control {
  selectable: number[]; // This is the list of id's of selectable values
  selected: number[]; // This is the list of id's of selected values
  isActive: boolean; // This is the state of the control
  capacity: number; // This is the maximum number of objects that can be selected at a time

  constructor({
    id,
    selectable,
    selected = [],
    isActive = false,
    capacity = 1,
    desc = "select control",
    text = "this is a select control",
  }: Partial<SelectControl> & {
    id: number;
    selectable: number[];
  }) {
    super({ id: id, desc: desc, text: text });
    this.selectable = selectable;
    this.selected = selected;
    this.isActive = isActive;
    this.capacity = capacity;
  }


  setIsActive(state: boolean): SelectControl {
    const clone = this.clone();
    clone.isActive = state;
    return clone;
  }

  SelectObj(obj_id: number): [SelectControl, boolean] {
    
    if (this.selected.length < this.capacity && this.isActive) {
      // check if obj_id does not already exist in the array
      if (!this.selected.includes(obj_id) && this.selectable.includes(obj_id)) {
        const new_selected = this.clone();
        new_selected.selected.push(obj_id);
        return [new_selected, true];
      } else {
        console.log("Object already selected or not selectable");
      }
    } else {
      console.log("Cannot select more than capacity");
    }
    return [this, false]
    
  }

  deselectObj(obj_id: number): [SelectControl, boolean] {
    if (this.selected.includes(obj_id)) {
      const new_selected = this.clone();
      new_selected.selected = new_selected.selected.filter((id: number) => id !== obj_id);
      return [new_selected, true];
    } else {
      console.log("Object was never selected");
    }
    return [this, false]
    
  }

  countSelected() {
    return this.selected.length;
  }

  clone() {
    const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    return clone
  }
}
