import * as THREE from 'three';
import { Interactobj } from './interactobj';

export class vizobj {
    position: THREE.Vector2;
    color: string = "blue";
    geom: THREE.BufferGeometry;
    control: Interactobj | null;

    constructor(position: THREE.Vector2, geom: THREE.BufferGeometry, color: string, control: Interactobj | null = null) {
      this.position = position;
      this.geom = geom;
      this.color = color;
      this.control = control;
    }
}
