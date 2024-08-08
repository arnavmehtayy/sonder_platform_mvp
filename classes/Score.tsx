import { obj } from "./obj";
import {objectScorer} from "./objectScorer";

export class Score<Score_T> {
  score_id: number;
  text: string;
  obj_list: objectScorer<any>[];
  transformation: (vals: number[]) => Score_T;
  to_string: (score: Score_T) => string;

  constructor({
    text,
    score_id,
    obj_list,
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
  }

  computeValue(objs: obj[]): Score_T {
    const filteredObjs = objs.filter(
      (obj) => obj !== undefined && obj.isEnabled
    );


    const vals = this.obj_list.map((obj, index) => obj.get_attribute(objs[index]))
    return this.transformation(vals);
    }
  

  validate(
    obj_list: obj[],
    comparer: (a: Score_T, b: Score_T) => number,
    target: Score_T,
    tolerance: number = 0.1
  ): boolean {
    return Math.abs(comparer(this.computeValue(obj_list), target)) < 0.1;
  }
}
