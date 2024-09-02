import { Control } from "./Control";
import { obj } from "../vizobjects/obj";


/*
 * This is the class that holds information about the select control
 * The select control is used to select objects on the three.js screen 
 * the attributes of this class are: 
 * selectable (set of objects that can be selected), 
 * selected (the objects that have been selected), 
 * isActive (if this select has been activated using the isActive button), 
 * capacity (the total number of objects that can be selected at a time)

*/
export class SelectControl extends Control {
  selectable: number[]; // This is the list of id's that a user can select using this select control
  selected: number[]; // This is the list of id's of the objects that have been selected by the user
  isActive: boolean; // This is true if the user has clicked the isActive button to activate the select control
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

  // change if this select state has been activated using the isActive button. This is used by the storage system
  setIsActive(state: boolean): SelectControl { 
    const clone = this.clone();
    clone.isActive = state;
    return clone;
  }

  // method ot try to select an object with the given id. This is used by the storage system
  // returns a tuple with the new select control with the updated selected list and a boolean indicating if the object was successfully added
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
    return [this, false];
  }

  // method to deselect an object with the given id. This is used by the storage system
  // returns a tuple with the new select control with the updated selected list and a boolean indicating if the object was successfully removed
  deselectObj(obj_id: number): [SelectControl, boolean] {
    if (this.selected.includes(obj_id)) {
      const new_selected = this.clone();
      new_selected.selected = new_selected.selected.filter(
        (id: number) => id !== obj_id
      );
      return [new_selected, true];
    } else {
      console.log("Object was never selected");
    }
    return [this, false];
  }

  countSelected() {
    return this.selected.length;
  }


}
