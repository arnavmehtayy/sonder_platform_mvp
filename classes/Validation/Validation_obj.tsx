import Validation from "./Validation";
import { Vector2, Vector3 } from "three";
import { TransformObj } from "../vizobjects/transformObj";
import * as Val_func from "./Validation_funcs";

export type value_typ = number | Vector2 | Vector3; // the possible types of the attribute that is to be validated 
export type relation = "==" | ">" | "<" | ">=" | "<=" | "!="; // the possible relations that can be used in the comparison

/*
 * this class stores information to validate a vizobjects attribute
 * T represents the type of the attribute that is to be validated
 * the attributes of this class are: answer, obj_id, 
 * get_attribute: function that gets the attribute of the object
 * error: the error that is allowed in the comparison
 * relation: the relation that is to be used in the comparison
*/

export default class Validation_obj<T extends value_typ> extends Validation {
  answer: T; // the answer that the attribute should be
  obj_id: number; // the id of the object that is to be validated
  get_attribute: (obj: TransformObj) => T; // function that gets the attribute of the object
  error: number;
  relation: relation; // this is the relation that is to be used in the comparison

  constructor({
    obj_id,
    answer,
    get_attribute,
    error = 0,
    relation = "==",
    desc = "validation_obj",
  }: Partial<Validation_obj<T>> & {
    obj_id: number;
    answer: T;
    get_attribute: (obj: TransformObj) => T;
  }) {
    super({ is_valid: false, desc: desc });
    this.answer = answer;
    this.obj_id = obj_id;
    this.get_attribute = get_attribute;
    this.error = error;
    this.relation = relation;
  }

  // method that given the object computes the validity of the object
  // this is used by the storage system
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
