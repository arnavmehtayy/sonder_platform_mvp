import { Vector2, Vector3 } from "three";
import { vizobj } from "./vizobj";

/*
    * This file contains the functions to get and set the attributes of a vizobj.
    * These functions are used in the ControlObj class to get and set the attributes of an object.

*/

export function get_position(obj: vizobj): Vector2 {
    return obj.position;
}

export function set_position(obj: vizobj, value: Vector2): vizobj {
    return { ...obj , position: value};
}

export function set_path_pos(obj: vizobj, value: Vector2, t: number): vizobj {
    return { ...obj , position: value, param_t: t};
}

export function get_rotation(obj: vizobj): Vector3 {
    return obj.rotation;
}

export function set_rotation(obj: vizobj, value: Vector3): vizobj {
    return { ...obj , rotation: value};
}

export function get_scale(obj: vizobj): Vector3 {
    return obj.scale;
}

export function set_scale(obj: vizobj, value: Vector3): vizobj {
    return { ...obj , scale: value};
}