import * as THREE from 'three';
import { Interactobj } from './interactobj';

export class vizobj {
    id: number = 0;
    position: THREE.Vector2;
    color: string = "blue";
    geom: THREE.BufferGeometry;
    control: Interactobj | null;

    constructor(id: number = 0, position: THREE.Vector2, geom: THREE.BufferGeometry, color: string, control: Interactobj | null = null) {
      this.position = position;
      this.geom = geom;
      this.color = color;
      this.control = control;
      this.id = id;
    }
}
