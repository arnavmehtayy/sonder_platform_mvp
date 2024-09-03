import { obj } from "../vizobjects/obj";
import { objectScorer } from "./objectScorer";

/*
  * This class is responsible for storing information about a score that is to be computed
  * the attributes of this class are: score_id, text, desc, 
  * obj_list: list of objects involed in the score computation
  * transformation: function that from the list of values of the objects, computes the score
  * to_string: takes the output of the transform and converts it into a string (this allows for the score to be displayed in the UI
*/

export class Score<Score_T> {
  score_id: number;
  text: string;
  desc: string;
  obj_list: objectScorer<any>[]; // list of objects involved in the score computation
  transformation: (vals: number[]) => Score_T; // function that from the list of values of the objects, computes the score
  to_string: (score: Score_T) => string; // function that takes the output of the transform and converts it into a string


  constructor({
    text,
    score_id,
    obj_list,
    desc = "",
    transformation,
    to_string = (score) => score as string,
  }: Partial<Score<Score_T>> & {
    text: string;
    score_id: number;
    obj_list: objectScorer<any>[];
    transformation: (vals: number[]) => Score_T;
  }) {
    this.text = text;
    this.to_string = to_string;
    this.score_id = score_id;
    this.transformation = transformation;
    this.obj_list = obj_list;
    this.desc = desc;
  }

  // method to compute the the score given the list of objects involved in the score computation
  computeValue(objs: obj[]): Score_T {
    const filteredObjs = objs.filter(
      (obj) => obj !== undefined && obj.isEnabled
    ); // remove any objects that are not enabled or undefined

    const vals = this.obj_list.map((obj, index) =>
      obj.get_attribute(objs[index])
    ); 
    return this.transformation(vals);
  }

  // method to compare this score with a target value given a comparison function
  validate(
    obj_list: obj[],
    comparer: (a: Score_T, b: Score_T) => number,
    target: Score_T,
    tolerance: number = 0.1
  ): boolean {
    return Math.abs(comparer(this.computeValue(obj_list), target)) < tolerance;
  }
}
