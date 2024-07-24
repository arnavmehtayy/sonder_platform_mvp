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
  }: Partial<SelectControl> & {
    id: number;
    selectable: number[];
  }) {
    super({ id: id });
    this.selectable = selectable;
    this.selected = selected;
    this.isActive = isActive;
    this.capacity = capacity;
  }


  setIsActive(state: boolean) : SelectControl {
    this.isActive = state;
    return this.clone();
  }

  SelectObj(obj_id: number): SelectControl {
    console.log(this.capacity, this.selected.length)
    if (this.selected.length < this.capacity && this.isActive) {
      // check if obj_id does not already exist in the array
      if (!this.selected.includes(obj_id) && this.selectable.includes(obj_id)) {
        this.selected.push(obj_id);
        return this.clone();
      } else {
        console.log("Object already selected or not selectable");
      }
    } else {
      console.log("Cannot select more than capacity");
    }
    return this
    
  }

  deselectObj(obj_id: number): SelectControl {
    if (this.selected.includes(obj_id)) {
      this.selected = this.selected.filter((id) => id !== obj_id);
      return this.clone();
    } else {
      console.log("Object was never selected");
    }
    return this
    
  }

  countSelected() {
    return this.selected.length;
  }

  clone() {
    const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    return clone
  }
}
