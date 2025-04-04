import { Line, Vector2, Vector3 } from "three";
import { TransformObj } from "./vizobjects/transformObj";
import { LineObj } from "./vizobjects/Lineobj";
import { DummyDataStorage, DummyDataSupportedTypes } from "./vizobjects/DummyDataStore";
import { obj } from "./vizobjects/obj";

/*
    * This file contains the functions to get and set the attributes of a vizobj.
    * These functions are used in the ControlObj class to get and set the attributes of an object.
*/

export function get_slope_intercept(obj: LineObj): Vector2 {
  if (obj instanceof LineObj) {
    return new Vector2(
      obj.get_slope_intercept()[0],
      obj.get_slope_intercept()[1]
    );
  }
  return new Vector2(0, 0);
}

export function get_end_point(obj: LineObj): Vector2 {
  if (obj instanceof LineObj) {
    return obj.end;
  }
  return new Vector2(0, 0);
}

export function set_start_point(obj: LineObj, value: Vector2): LineObj {
  const new_obj = LineObj.set_endpoints(obj, value, obj.end);
  new_obj.line_width = obj.line_width;
  return new_obj;
}

export function set_end_point(obj: LineObj, value: Vector2): LineObj {
  const new_obj = LineObj.set_endpoints(obj, obj.start, value);
  new_obj.line_width = obj.line_width;
  return new_obj;
}
export function get_slope(obj: LineObj): number {
  return obj.get_slope_intercept()[1];
}

export function set_slope(obj: LineObj, value: number): LineObj {
  // change
  const slope_intercept = obj.get_slope_intercept();
  slope_intercept[1] = value;
  const new_obj = LineObj.set_slope_intercept(
    obj,
    slope_intercept[0],
    slope_intercept[1],
    slope_intercept[2]
  );
  new_obj.line_width = obj.line_width;
  return new_obj;
}

export function get_length(obj: LineObj): number {
  if (obj instanceof LineObj) {
    return obj.get_length();
  }
  return 0;
}

export function get_intercept(obj: LineObj): number {
  return obj.get_slope_intercept()[0];
}

export function set_intercept(obj: LineObj, value: number): LineObj {
  // change
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
  if (obj) {
    return obj.position;
  }
  return new Vector2(0, 0);
}

export function set_position<T>(obj: TransformObj, value: T): TransformObj {
  const new_obj = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
  new_obj.position = value;
  return new_obj;
}

export function set_path_pos<T>(obj: T, value: Vector2, t: number): T {
  const new_obj = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
  new_obj.position = value;
  new_obj.param_t = t;
  return new_obj;
}

export function get_rotation(obj: TransformObj): Vector3 {
  return obj.rotation;
}

export function set_rotation<T>(obj: T, value: Vector3): T {
  const new_obj = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
  new_obj.rotation = value;
  return new_obj;
}

export function get_scale(obj: TransformObj): Vector3 {
  return obj.scale;
}

export function set_scale<T>(obj: T, value: Vector3): T {
  const new_obj = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
  new_obj.scale = value;
  return new_obj;
}

export function getDummyValue<T extends DummyDataSupportedTypes>(
  obj: DummyDataStorage<T>
): T {
  return obj.data;
}

export function setDummyValue<T extends DummyDataSupportedTypes>(
  obj: DummyDataStorage<T>,
  value: T
): DummyDataStorage<T> {
  return DummyDataStorage.setData(obj, value);
}
