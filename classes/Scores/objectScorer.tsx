import { obj } from "../vizobjects/obj";

/*

 * this is used by the score class to store information about how each of the objects involved are to be scored
 * the attributes of this class are: id, get_attribute

*/
export class objectScorer<obj_T extends obj> {
  id: number;
  get_attribute: (obj: obj_T) => number;

  constructor({
    id,
    get_attribute,
  }: {
    id: number;
    get_attribute: (obj: obj_T) => number;
  }) {
    this.id = id;
    this.get_attribute = get_attribute;
  }
}
