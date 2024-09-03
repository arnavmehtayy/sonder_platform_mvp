import Validation from "./Validation";
import { obj } from "../vizobjects/obj";
import { relation } from "./Validation_obj";

/*
 * this class stores information to validate a score
 * score_T represents the type of the score that is to be validated
 * obj_T represents the type of the object that is to be validated
 * attributes: score_id, target_score, error, relation, comparator
 */

export default class Validation_score<
  score_T,
  obj_T extends obj
> extends Validation {
  score_id: number;
  target_score: score_T;
  error: number;
  relation: relation; // this is the relation that is to be used in the comparison
  comparator: (a: score_T, b: score_T) => number; // this is the function that is used to compare the scores

  constructor({
    score_id,
    target_score,
    error,
    relation,
    comparator = (a, b) => (a > b ? 1 : a < b ? -1 : 0),
    desc = "validation_score",
  }: Partial<Validation_score<score_T, obj_T>> & {
    score_id: number;
    target_score: number;
    error: number;
    relation: relation;
  }) {
    super({ is_valid: false, desc: desc });
    this.score_id = score_id;
    this.target_score = target_score;
    this.error = error;
    this.relation = relation;
    this.comparator = comparator;
  }


  // method that given the score computes the validity of that score
  // this is used by the storage system
  computeValidity(score: score_T): Validation_score<string, obj_T> {
    // console.log("score", score, this.target_score);
    switch (this.relation) {
      case ">":
        if (this.comparator(score, this.target_score) > -this.error) {
          return this.set_valid(true) as Validation_score<string, obj_T>;
        }
        break;
      case "<":
        if (this.comparator(score, this.target_score) < this.error) {
          return this.set_valid(true) as Validation_score<string, obj_T>;
        }
        break;
      case ">=":
        if (this.comparator(score, this.target_score) >= -this.error) {
          return this.set_valid(true) as Validation_score<string, obj_T>;
        }
        break;
      case "<=":
        if (this.comparator(score, this.target_score) <= this.error) {
          return this.set_valid(true) as Validation_score<string, obj_T>;
        }
        break;
      case "!=":
        if (Math.abs(this.comparator(score, this.target_score)) > this.error) {
          return this.set_valid(true) as Validation_score<string, obj_T>;
        }
        break;
      case "==":
        if (Math.abs(this.comparator(score, this.target_score)) < this.error) {
          return this.set_valid(true) as Validation_score<string, obj_T>;
        }
        break;
    }
    return this.set_valid(false) as Validation_score<string, obj_T>;
  }
}
