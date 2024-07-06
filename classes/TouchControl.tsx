import { action_typ } from "./SliderControl";
import * as THREE from "three";
import { vizobj } from "./vizobj";

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
  }> & { vizobj: vizobj }): vizobj {
    return {
      ...vizobj,
      position: position
        ? new THREE.Vector2(position.x, position.y)
        : vizobj.position,
      rotation: rotation ? rotation : vizobj.rotation,
      scale: scale ? scale : vizobj.scale,
    };
  }
}
