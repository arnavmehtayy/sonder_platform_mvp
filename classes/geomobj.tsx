import { TransformObj } from "./transformObj";
import * as THREE from "three";
import { TouchControl } from "./TouchControl";

/*
    * This class creates a geometric object on the scene (Any object that is rendered using THREE.BufferGeometry).
*/

export class geomobj extends TransformObj {
  color: string;
  geom: THREE.BufferGeometry;
  isClickable: boolean = false;
  OnClick: ((obj: geomobj) => void) | undefined;
  constructor({
    id,
    position = new THREE.Vector2(0, 0),
    rotation = new THREE.Vector3(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    color = "blue",
    geom, // geom remains a required parameter
    touch_controls = new TouchControl(),
    param_t = 0,
    isClickable = false,
    OnClick = undefined,
  }: Partial<geomobj> & { geom: THREE.BufferGeometry; id: number }) {
    super({
      position: position,
      rotation: rotation,
      scale: scale,
      touch_controls: touch_controls,
      param_t: param_t,
      id: id,
    });
    this.geom = geom;
    this.color = color;
    this.isClickable = isClickable;
    this.OnClick = OnClick;
  }
}
