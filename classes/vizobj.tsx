import * as THREE from 'three';

export class vizobj {
    position: THREE.Vector2;
    color: string = "blue";
    geom: THREE.BufferGeometry;
   
    constructor(position: THREE.Vector2, geom: THREE.BufferGeometry, color: string) {
      this.position = position;
      this.geom = geom;
      this.color = color
    }
}
