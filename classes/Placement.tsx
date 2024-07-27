import * as THREE from "three";
export default class Placement {
  object_ids: number[];
  grid: [number, number];
  cellSize: number;
  geometry: THREE.BufferGeometry;
  gridVectors: THREE.Vector2[];
  text: string;
  color: string;


  constructor({
    object_ids,
    grid = [0, 0],
    cellSize = 0,
    geometry = new THREE.PlaneGeometry(4, 4),
    gridVectors = [],
    text = "Click to place objects",
    color = "blue"
  }: Partial<Placement> & { object_ids: number[] }) {
    this.object_ids = object_ids;
    this.grid = grid;
    this.cellSize = cellSize;
    this.geometry = geometry;
    this.gridVectors = gridVectors;
    this.text = text;  
    this.color = color
  }
}
