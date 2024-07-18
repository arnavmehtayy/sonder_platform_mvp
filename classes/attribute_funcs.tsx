import { Line, Vector2, Vector3 } from "three";
import { TransformObj } from "./transformObj";
import { LineObj } from "./Lineobj";

/*
    * This file contains the functions to get and set the attributes of a vizobj.
    * These functions are used in the ControlObj class to get and set the attributes of an object.

*/
export function get_slope_intercept(obj: LineObj): Vector2 {
  return new Vector2(
    obj.get_slope_intercept()[0],
    obj.get_slope_intercept()[1]
  );
}

export function get_end_point(obj: LineObj): Vector2 {
  return obj.end;
}
export function set_end_point(
  obj: LineObj,
  value: Vector2
): LineObj {
  const new_obj = LineObj.set_endpoints(obj, obj.start, value);
  new_obj.line_width = obj.line_width;
  return new_obj;
}
export function get_slope(obj: LineObj): number {
  return obj.get_slope_intercept()[1];
}

export function set_slope( // change
  obj: LineObj,
  value: number
): LineObj {
  const slope_intercept = obj.get_slope_intercept();
  slope_intercept[1] = value;
  const new_obj =  LineObj.set_slope_intercept(
    obj,
    slope_intercept[0],
    slope_intercept[1],
    slope_intercept[2]
  );
  new_obj.line_width = obj.line_width;
  return new_obj;
}

export function get_intercept(obj: LineObj): number {
  return obj.get_slope_intercept()[0];
}

export function set_intercept( // change
  obj: LineObj,
  value: number
): LineObj {
  const slope_intercept = obj.get_slope_intercept();
  const new_obj = LineObj.set_slope_intercept(
    obj,
    value,
    slope_intercept[1],
    slope_intercept[2]
  );
  new_obj.line_width = obj.line_width;
  return new_obj;
}

export function get_position(obj: TransformObj): Vector2 {
  return obj.position;
}

export function set_position<T>(
  obj: TransformObj,
  value: T
): TransformObj {
    const new_obj = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
    new_obj.position = value;
  return new_obj;
}

export function set_path_pos<T>(
  obj: T,
  value: Vector2,
  t: number
): T {
    const new_obj = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
    new_obj.position = value;
    new_obj.param_t = t;
    return new_obj;
}

export function get_rotation(obj: TransformObj): Vector3 {
  return obj.rotation;
}

export function set_rotation<T>(
  obj: T,
  value: Vector3
): T{
  const new_obj = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
  new_obj.rotation = value;
  return new_obj;
}

export function get_scale(obj: TransformObj): Vector3 {
  return obj.scale;
}

export function set_scale<T>(
  obj: T,
  value: Vector3
): T {
    const new_obj = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
    new_obj.scale = value;
    return new_obj;
}
