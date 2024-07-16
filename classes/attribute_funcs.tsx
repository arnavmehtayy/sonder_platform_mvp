import { Vector2, Vector3 } from "three";
import { vizobj } from "./vizobj";
import { CustomLine } from "./customLine";

/*
    * This file contains the functions to get and set the attributes of a vizobj.
    * These functions are used in the ControlObj class to get and set the attributes of an object.

*/
export function get_end_point(obj: vizobj): Vector2 {
  if (obj.geom instanceof CustomLine) {
    return obj.geom.end;
  }
  return new Vector2(0, 0);
}
export function set_end_point(obj: vizobj, value: Vector2): vizobj {
  if (obj.geom instanceof CustomLine) {
    const new_geom = obj.geom.set_endpoints(obj.geom.start, value);
    new_geom.line_width = obj.geom.line_width;
    return { ...obj, geom: new_geom };
  }
  return obj;
}
export function get_slope(obj: vizobj): number {
  if (obj.geom instanceof CustomLine) {
    return obj.geom.get_slope_intercept()[1];
  }
  return 0;
}

export function set_slope(obj: vizobj, value: number): vizobj {
  if (!(obj.geom instanceof CustomLine)) return obj;
  const slope_intercept = obj.geom.get_slope_intercept();
  slope_intercept[1] = value;
  const new_geom = obj.geom.set_slope_intercept(
    slope_intercept[0],
    slope_intercept[1],
    slope_intercept[2]
  );
  new_geom.line_width = obj.geom.line_width;
  return { ...obj, geom: new_geom };
}

export function get_intercept(obj: vizobj): number {
  if (obj.geom instanceof CustomLine) {
    return obj.geom.get_slope_intercept()[0];
  }
  return 0;
}

export function set_intercept(obj: vizobj, value: number): vizobj {
  if (!(obj.geom instanceof CustomLine)) return obj;
  const slope_intercept = obj.geom.get_slope_intercept();
  slope_intercept[0] = value;
  const new_geom = obj.geom.set_slope_intercept(
    slope_intercept[0],
    slope_intercept[1],
    slope_intercept[2]
  );
  new_geom.line_width = obj.geom.line_width;
  return { ...obj, geom: new_geom };
}

export function get_position(obj: vizobj): Vector2 {
  return obj.position;
}

export function set_position(obj: vizobj, value: Vector2): vizobj {
  return { ...obj, position: value };
}

export function set_path_pos(obj: vizobj, value: Vector2, t: number): vizobj {
  return { ...obj, position: value, param_t: t };
}

export function get_rotation(obj: vizobj): Vector3 {
  return obj.rotation;
}

export function set_rotation(obj: vizobj, value: Vector3): vizobj {
  return { ...obj, rotation: value };
}

export function get_scale(obj: vizobj): Vector3 {
  return obj.scale;
}

export function set_scale(obj: vizobj, value: Vector3): vizobj {
  return { ...obj, scale: value };
}
