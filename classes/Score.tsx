import { obj } from "./obj";

export class Score<Score_T, obj_T extends obj> {
    
  score_id: number;
  obj_id_list: number[]; // these are the objects that will be used to compute the store
  text: string;
  get_attribute: (obj: obj_T) => number; // Function to get the attribute of the object
  transformation: (vals: number[]) => Score_T;
  to_string: (score: Score_T) => string;

  constructor({
    text,
    score_id,
    obj_id_list,
    get_attribute,
    transformation,
    to_string = (score) => score as string
  }: Partial<Score<Score_T, obj_T>> & {
    text: string;
    score_id: number
    obj_id_list: number[];
    get_attribute: (obj: obj_T) => number;
    transformation: (vals: number[]) => Score_T;
  }) {
    this.text = text;
    this.to_string = to_string;
    this.score_id = score_id;
    this.obj_id_list = obj_id_list;
    this.get_attribute = get_attribute;
    this.transformation = transformation;
  }

  computeValue(objs: obj_T[]): Score_T {
    const vals = objs.map((obj) => this.get_attribute(obj));
    return this.transformation(vals);
  }

  validate(
    obj_list: obj_T[],
    comparer: (a: Score_T, b: Score_T) => number,
    target: Score_T,
    tolerance: number = 0.1
  ): boolean {
    return Math.abs(comparer(this.computeValue(obj_list), target)) < 0.1;
  }

  
}
