import { Vector2, Vector3 } from "three";
import { vizobj } from "./vizobj";

export function get_position(obj: vizobj): Vector2 {
    return obj.position;
}

export function set_position(obj: vizobj, value: Vector2): vizobj {
    return { ...obj , position: value};
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