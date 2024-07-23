import * as THREE from "three";
export default class Placement {
  object_ids: number[];
  grid: [number, number];
  cellSize: number;
  geometry: THREE.BufferGeometry;
  gridVectors: THREE.Vector2[];

  constructor({
    object_ids,
    grid = [10, 10],
    cellSize = 1,
    geometry = new THREE.PlaneGeometry(4, 4),
    gridVectors = [],
  }: Partial<Placement> & { object_ids: number[] }) {
    this.object_ids = object_ids;
    this.grid = grid;
    this.cellSize = cellSize;
    this.geometry = geometry;
    this.gridVectors = gridVectors;
  }
}
