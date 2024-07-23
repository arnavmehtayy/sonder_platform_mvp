import { RefObject, ReactElement, JSXElementConstructor } from "react";
import { obj } from "./obj";
import { Vector2 } from "three";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";

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
    name = "Line",
    isClickable = true,
  }: Partial<LineObj> & { id: number }) {
    super({ id: id, name: name });
    this.start = start;
    this.end = end;
    this.line_width = line_width;
    this.color = color;
    this.isClickable = isClickable;
  }

  static set_slope_intercept(
    obj: LineObj,
    b: number,
    m: number,
    range: [number, number]
  ) {
    const start = new THREE.Vector2(range[0], m * range[0] + b);
    const end = new THREE.Vector2(range[1], m * range[1] + b);
    return new LineObj({ ...obj, start: start, end: end });
  }

  static set_endpoints(obj: LineObj, start: Vector2, end: Vector2) {
    return new LineObj({ ...obj, start: start, end: end });
  }



  get_slope_intercept(): [number, number, [number, number]] {
    if (this.end.x - this.start.x === 0) {
      return [this.start.y, 0, [this.start.x, this.end.x]];
    }
    const m = (this.end.y - this.start.y) / (this.end.x - this.start.x);
    const b = this.start.y - m * this.start.x;
    return [b, m, [this.start.x, this.end.x]];
  }

  get_length(): number {
    return this.start.distanceTo(this.end);
  }

  getMesh({
    children = null,
    onClickSelect,
    objectRef,
  }: Partial<{
    children: React.ReactElement | null;
    onClickSelect: (event:  ThreeEvent<MouseEvent>) => void;
    objectRef: RefObject<THREE.Mesh>;
  }> & {
    objectRef: RefObject<THREE.Mesh>;
  }): ReactElement<any, string | JSXElementConstructor<any>> {
    return super.getMesh({
      children: (
        <Line
          points={[
            [this.start.x, this.start.y, 0],
            [this.end.x, this.end.y, 0],
          ]} // Array of points, Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
          color={this.color} // Default
          lineWidth={this.line_width} // In pixels (default)
          segments // If true, renders a THREE.LineSegments2. Otherwise, renders a THREE.Line2
          dashed={false} // Default
          {...{ linebutt: "round", linecap: "round" }}
        />
      ),
      onClickSelect: onClickSelect,
      objectRef: objectRef,
    });
  }
}
