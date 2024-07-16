import { Vector2 } from "three";
import * as THREE from "three";

export class CustomLine {
  start: Vector2;
  end: Vector2;
  line_width: number = 2;

  constructor( {
    start = new Vector2(1, 1),
    end = new Vector2(0, 0),
    line_width = 2
  } : Partial<CustomLine> 
  ) {
  
    this.start = start;
    this.end = end;
    this.line_width = line_width;
  }

  set_slope_intercept(b: number, m: number, range: [number, number]) {
    this.start = new THREE.Vector2(range[0], m * range[0] + b);
    this.end = new THREE.Vector2(range[1], m * range[1] + b);
    return new CustomLine({start: this.start, end: this.end})
  }

  set_endpoints(start: Vector2, end: Vector2) {
    this.start = start;
    this.end = end;
    return new CustomLine({start: this.start, end: this.end})
  }

  get_slope_intercept(): [number, number, [number, number]] {
    const m = (this.end.y - this.start.y) / (this.end.x - this.start.x);
    const b = this.start.y - m * this.start.x;
    return [b, m, [this.start.x, this.end.x]];
  }
}
