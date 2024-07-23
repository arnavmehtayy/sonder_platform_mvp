import * as THREE from "three";
export default class Placement {
  object_id: number;
  grid: [number, number];
  cellSize: number;
  geometry: THREE.BufferGeometry;
  gridVectors: THREE.Vector3[];

  constructor({
    object_id,
    grid = [10, 10],
    cellSize = 1,
    geometry = new THREE.PlaneGeometry(4, 4),
    gridVectors = [],
  }: Partial<Placement> & { object_id: number }) {
    this.object_id = object_id;
    this.grid = grid;
    this.cellSize = cellSize;
    this.geometry = geometry;
    this.gridVectors = gridVectors;
  }
}
