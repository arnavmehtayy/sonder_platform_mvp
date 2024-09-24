import { obj } from "../vizobjects/obj";

/*

 * this is used by the score class to store information about how each of the objects involved are to be scored
 * the attributes of this class are: id, get_attribute

*/

interface objectScorerConstructor<obj_T extends obj> {
  id: number;
  get_attribute: (obj: obj_T) => number;
}

export class objectScorer<obj_T extends obj> {
  id: number;
  get_attribute: (obj: obj_T) => number;

  constructor({
    id,
    get_attribute,
  }: objectScorerConstructor<obj_T>) {
    this.id = id;
    this.get_attribute = get_attribute;
  }

  databaseSave(): objectScorerConstructor<obj_T> {
    return {
      id: this.id,
      get_attribute: this.get_attribute,
    };
  }
}
