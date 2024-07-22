import * as THREE from "three";
import { SliderControl } from "./SliderControl";
import { TouchControl } from "./TouchControl";
import { obj } from "./obj";

/*
  * This class stores the position, scale and rotation attributes of an object in the scene.
  * This is the ground truth data that is used to render the object in the scene.
  * This class also store the touch controls

*/

export class TransformObj extends obj {
  position: THREE.Vector2;
  rotation: THREE.Vector3;
  scale: THREE.Vector3;
  touch_controls: TouchControl;
  param_t: number; // if we have a parametric curve, this is the parameter value

  constructor({
    id,
    position = new THREE.Vector2(0, 0),
    rotation = new THREE.Vector3(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    touch_controls = new TouchControl(),
    param_t = 0,
    name = "TransformObj",
  }: Partial<TransformObj> & { id: number }) {
    super({ id: id, name: name});
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.touch_controls = touch_controls;
    this.param_t = param_t;
  }
}
