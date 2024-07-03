import * as THREE from "three";
import { ControlObj } from "./ControlObj";

/*
  * This class stores the attributes of a visual object in the scene.
  * This is the ground truth data that is used to render the object in the scene.

*/

export class vizobj {
  id: number = 0; // Every object has a unique id
  position: THREE.Vector2;
  rotation: THREE.Vector3;
  scale: THREE.Vector3;
  color: string = "blue";
  geom: THREE.BufferGeometry;

  constructor(
    id: number = 0,
    position: THREE.Vector2,
    rotation: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
    scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1),
    geom: THREE.BufferGeometry,
    color: string
  ) {
    this.position = position;
    this.geom = geom;
    this.color = color;
    this.id = id;
    this.rotation = rotation;
    this.scale = scale;
  }
}
