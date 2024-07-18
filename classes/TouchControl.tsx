
import * as THREE from "three";
import { TransformObj } from "./transformObj";

type TouchControlAttributes = {
  direction: [boolean, boolean, boolean];
  range: [number, number];
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
    // we are fine with any here since we are not touching the geom which is the parameter controlled by T
    return new TransformObj({id: vizobj.id, position: position
        ? new THREE.Vector2(position.x, position.y)
        : vizobj.position,
      rotation: rotation ? rotation : vizobj.rotation,
      scale: scale ? scale : vizobj.scale,
    touch_controls: vizobj.touch_controls,
    param_t: vizobj.param_t,})
    
  }

  static populate_vizobj_general<T extends TransformObj>({
        vizobj,
        position,
        scale,
        rotation,
      }: Partial<{
        position: THREE.Vector3;
        scale: THREE.Vector3;
        rotation: THREE.Vector3;
      }> & { vizobj: T }): T {

    const newObj = Object.assign(Object.create(Object.getPrototypeOf(vizobj)), vizobj);
    // Create a new object with the same prototype as the given object

    // Update the given properties
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
        // we are fine with any here since we are not touching the geom which is the parameter controlled by T
      }
}
