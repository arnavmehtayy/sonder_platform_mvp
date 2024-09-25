

import * as THREE from "three";
import { TransformObj } from "../vizobjects/transformObj";

/*
 * This class stores information about the touch control (drei TransformControls for every object)
 * this class is used by the GeneralTransformControls component to determine the attributes of the touch controls
 * the attributes of this class are: scale, rotate, translate
 * each of the above attributes are of type TouchControlAttributes and they define the direction, range and step size of the control of that type
 */

export type TouchControlAttributes = {
  direction: [boolean, boolean, boolean]; // the direction in which we allow the control to move in
  step_size: number;
} | null;

export class TouchControl {
  scale: TouchControlAttributes;
  rotate: TouchControlAttributes;
  translate: TouchControlAttributes;

  constructor({
    scale = null,
    rotate = null,
    translate = null,
  }: Partial<{
    scale: TouchControlAttributes;
    rotate: TouchControlAttributes;
    translate: TouchControlAttributes;
  }> = {}) {
    this.scale = scale;
    this.rotate = rotate;
    this.translate = translate;
  }


  // change the position, scale and rotation of a vizobject used by the storage system
  static populate_vizobj({
    vizobj,
    position,
    scale,
    rotation,
  }: Partial<{
    position: THREE.Vector3;
    scale: THREE.Vector3;
    rotation: THREE.Vector3;
  }> & { vizobj: TransformObj }): TransformObj {
    const newObj = Object.assign(
      Object.create(Object.getPrototypeOf(vizobj)),
      vizobj
    );
    // Create a new object with the same prototype as the given object

    if (position) {
      newObj.position = new THREE.Vector2(position.x, position.y);
    }
    if (scale) {
      newObj.scale = scale;
    }
    if (rotation) {
      newObj.rotation = rotation;
    }

    return newObj;
  }
}
