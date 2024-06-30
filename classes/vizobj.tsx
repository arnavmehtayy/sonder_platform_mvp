import * as THREE from "three";
import { Interactobj } from "./interactobj";

export class vizobj {
  id: number = 0;
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
