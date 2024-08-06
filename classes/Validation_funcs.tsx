import * as THREE from "three";
import { value_typ } from "./Validation_obj";

export function compare<T extends value_typ>( // if greater than 0 then a is greater than b, if less than 0 then a is less than b, if 0 then a is equal to b
  a: T,
  b: T,
  error: number,
) {
  if(isEqual(a, b, error)) {
    return 0;
  }

  if (typeof a === "number" && typeof b === "number") {
    return a-b;
  } else if (a instanceof THREE.Vector2 && b instanceof THREE.Vector2) {
    return -1
  } else if (a instanceof THREE.Vector3 && b instanceof THREE.Vector3) {
    return -1
  }
  return -1

}



export function isEqual<T extends value_typ>(a: T, b: T, error: number) {
  if (typeof a === "number" && typeof b === "number") {
    return isnumberEqual(a, b, error);
  } else if (a instanceof THREE.Vector2 && b instanceof THREE.Vector2) {
    return isPositionEqual(a, b, error);
  } else if (a instanceof THREE.Vector3 && b instanceof THREE.Vector3) {
    return isPositionEqual3(a, b, error);
  }
  return false;
}

export function isnumberGreater(a: number, b: number, error: number) {
  return a - b >= error;
}

export function isnumberLess(a: number, b: number, error: number) {
  return b - a >= error;
}

export function isListContains(list: any[], value: any) {
  return list.includes(value);
}

export function isListEqual(list1: any[], list2: any[]) {
  return JSON.stringify(list1) === JSON.stringify(list2);
}

export function isListLengthEqual(list1: any[], list2: any[]) {
  return list1.length === list2.length;
}

export function isAnyNItemsEqual(list1: any[], list2: any[], n: number) {
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (list1[i] === list2[i]) {
      count++;
    }
  }
  return count === n;
}

// equality checking

function isnumberEqual(a: number, b: number, error: number) {
  return Math.abs(a - b) <= error;
}

function isPositionEqual(
  pos1: THREE.Vector2,
  pos2: THREE.Vector2,
  error: number
) {
  return Math.abs(pos1.x - pos2.x) < error && Math.abs(pos1.y - pos2.y) < error;
}
function isPositionEqual3(
  pos1: THREE.Vector3,
  pos2: THREE.Vector3,
  error: number
) {
  return (
    Math.abs(pos1.x - pos2.x) < error &&
    Math.abs(pos1.y - pos2.y) < error &&
    Math.abs(pos1.z - pos2.z) < error
  );
}
