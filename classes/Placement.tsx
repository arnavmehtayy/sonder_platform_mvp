import * as THREE from "three";
export default class Placement {
  object_ids: number[];
  grid: [number, number];
  cellSize: number;
  geometry: THREE.BufferGeometry;
  gridVectors: THREE.Vector2[];
  text: string;
  color: string;
  desc: string;
  isClickable: boolean;


  constructor({
    object_ids,
    grid = [0, 0],
    cellSize = 0,
    geometry = new THREE.PlaneGeometry(4, 4),
    gridVectors = [],
    text = "Click to place objects",
    desc = "placement",
    color = "blue",
    isClickable = true
  }: Partial<Placement> & { object_ids: number[] }) {
    this.desc = desc
    this.object_ids = object_ids;
    this.grid = grid;
    this.cellSize = cellSize;
    this.geometry = geometry;
    this.gridVectors = gridVectors;
    this.text = text;  
    this.color = color
    this.isClickable = isClickable

  }

  static setPlacementisClickable(obj: Placement, isClickable: boolean): Placement{
    const newObj = Object.assign(
      Object.create(Object.getPrototypeOf(obj)),
      obj
    );
    obj.isClickable = isClickable;
    return obj;
  }
}
