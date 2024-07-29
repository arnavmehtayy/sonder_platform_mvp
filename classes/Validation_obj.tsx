import Validation from "./Validation";
import { action_typ } from "./SliderContTrans";
import { Vector2, Vector3 } from "three";
import { obj } from "./obj";
import { TransformObj } from "./transformObj";
import * as Val_func from "./Validation_funcs";

export type value_typ = number | Vector2 | Vector3;
export type relation = "==" | ">" | "<" | ">=" | "<=" | "!=";

export default class Validation_obj<T extends value_typ> extends Validation {
  answer: T;
  obj_id: number;
  get_attribute: (obj: TransformObj) => T;
  error: number;
  relation: relation;

  constructor({
    obj_id,
    answer,
    get_attribute,
    error = 0.1,
    relation = "==",
  }: Partial<Validation_obj<T>> & {
    obj_id: number;
    answer: T;
    get_attribute: (obj: TransformObj) => T;
    error: number;
  }) {
    super({ is_valid: false });
    this.answer = answer;
    this.obj_id = obj_id;
    this.get_attribute = get_attribute;
    this.error = error;
    this.relation = relation;
  }
  computeValidity(obj: TransformObj): Validation_obj<T> {
    switch (this.relation) {
      case ">":
        if (
          Val_func.compare(this.get_attribute(obj), this.answer, this.error) > 0
        ) {
          return this.set_valid(true) as Validation_obj<T>;
        }
        break;
      case "<":
        if (
          Val_func.compare(this.get_attribute(obj), this.answer, this.error) < 0
        ) {
          return this.set_valid(true) as Validation_obj<T>;
        }
        break;
      case ">=":
        if (
          Val_func.compare(this.get_attribute(obj), this.answer, this.error) >=
          0
        ) {
          return this.set_valid(true) as Validation_obj<T>;
        }
        break;
      case "<=":
        if (
          Val_func.compare(this.get_attribute(obj), this.answer, this.error) <=
          0
        ) {
          return this.set_valid(true) as Validation_obj<T>;
        }
        break;
      case "!=":
        if (
          Val_func.compare(this.get_attribute(obj), this.answer, this.error) !==
          0
        ) {
          return this.set_valid(true) as Validation_obj<T>;
        }
        break;
      case "==":
        if (
          Val_func.compare(this.get_attribute(obj), this.answer, this.error) ===
          0
        ) {
          return this.set_valid(true) as Validation_obj<T>;
        }
    }

    return this.set_valid(false) as Validation_obj<T>;
  }
}
