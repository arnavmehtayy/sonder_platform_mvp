import * as THREE from "three";
import { SliderControl } from "./SliderControl";
import { TouchControl } from "./TouchControl";

/*
  * This class stores the attributes of a visual object in the scene.
  * This is the ground truth data that is used to render the object in the scene.

*/

export class vizobj {
  id: number;
  position: THREE.Vector2;
  rotation: THREE.Vector3;
  scale: THREE.Vector3;
  color: string;
  geom: THREE.BufferGeometry;
  touch_controls: TouchControl;
  param_t: number; // if we have a parametric curve, this is the parameter value

  constructor({
    id,
    position = new THREE.Vector2(0, 0),
    rotation = new THREE.Vector3(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    color = "blue",
    geom, // geom remains a required parameter
    touch_controls = new TouchControl(),
    param_t = 0,
  }: Partial<vizobj> & { geom: THREE.BufferGeometry; id: number }) {
    this.id = id;
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.color = color;
    this.geom = geom;
    this.touch_controls = touch_controls;
    this.param_t = param_t;
  }
}
