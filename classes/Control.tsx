export class Control {
  id: number; // This is the id of the control
  desc: string; // This is the description of the control
    text: string; // This is the text

    constructor({
        id,
        desc = "control",
        text = "this is a description of the control",
    }: {
        id: number;
        desc: string;
        text: string;
    }) {
        this.id = id;
        this.desc = desc;
        this.text = text;
    }
}
