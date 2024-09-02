/*
 * this is the parent class for all the controls
 * it has the following properties: id, desc, text, isClickable (if the control can be interacted with)
*/


export class Control {
  id: number; // This is the id of the control
  desc: string; // This is the description of the control
    text: string; // This is the text
    isClickable: boolean; // This is the interactivity state of the control

    constructor({
        id,
        desc = "control",
        text = "this is a description of the control",
        isClickable = true,
    }: Partial<Control> & {
        id: number;
        desc: string;
        text: string;
    }) {
        this.id = id;
        this.desc = desc;
        this.text = text;
        this.isClickable = isClickable
    }

    // change the interactivity state of the control. This is used by the storage system
    static setControlisClickable(obj: Control, isClickable: boolean): Control{
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        ); // create a new copy of this object with the same prototype
        obj.isClickable = isClickable;
        return obj;
      } 

    clone() {
        const clone = Object.assign(
          Object.create(Object.getPrototypeOf(this)),
          this
        );
        return clone;
      }
}
