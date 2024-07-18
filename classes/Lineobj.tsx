import { obj } from "./obj";
import { Vector2 } from "three";
import * as THREE from "three";

/*
    * This class is used to render a Line object in the scene.
    * This stores the start and end points of the line, and the line width.
    * This class provides functionality to convert between slope_intercept form and end points form.
    

*/

export class LineObj extends obj {
  start: Vector2;
  end: Vector2;
  line_width: number = 2;
  color: string;

  constructor({
    id,
    start = new Vector2(1, 1),
    end = new Vector2(0, 0),
    line_width = 2,
    color = "white",
  }: Partial<LineObj> & { id: number }) {
    super({ id: id });
    this.start = start;
    this.end = end;
    this.line_width = line_width;
    this.color = color
  }


  static set_slope_intercept(
    obj: LineObj,
    b: number,
    m: number,
    range: [number, number]
  ) {
    const start = new THREE.Vector2(range[0], m * range[0] + b);
    const end = new THREE.Vector2(range[1], m * range[1] + b);
    return new LineObj({ ...obj, start: start, end: end});
  }

  static set_endpoints(obj: LineObj, start: Vector2, end: Vector2) {
    return new LineObj({ ...obj, start: start, end: end});
  }

  get_slope_intercept(): [number, number, [number, number]] {
    if (this.end.x - this.start.x === 0) {
      return [this.start.y, 0, [this.start.x, this.end.x]];
    }
    const m = (this.end.y - this.start.y) / (this.end.x - this.start.x);
    const b = this.start.y - m * this.start.x;
    return [b, m, [this.start.x, this.end.x]];
  }
}
