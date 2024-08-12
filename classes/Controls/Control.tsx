export class Control {
  id: number; // This is the id of the control
  desc: string; // This is the description of the control
    text: string; // This is the text
    isClickable: boolean; // This is the state of the control

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

    static setControlisClickable(obj: Control, isClickable: boolean): Control{
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        obj.isClickable = isClickable;
        return obj;
      }
}
