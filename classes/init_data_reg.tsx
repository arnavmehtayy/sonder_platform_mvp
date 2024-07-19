import { Vector2, Vector3 } from "three";
import * as att_funcs from "./attribute_funcs";
import { Influence } from "./influence";
import { SliderControl } from "./SliderControl";
import { TouchControl } from "./TouchControl";
import { TransformObj } from "./transformObj";
import * as THREE from "three";
import { LineObj } from "./Lineobj";
import { obj } from "./obj";
import { geomobj } from "./geomobj";
import { Select } from "@react-three/drei";
import { SelectControl } from "./SelectControl";
import { Control } from "./Control";
import { Score } from "./Score";
/*
 * This file contains the initial data that initializes the store in the app.
 */
// (obj, value) => att_funcs.set_position(obj, new Vector2(5 * Math.cos(value.x), 5 * Math.sin(value.y)))
export const influencesData: Influence<any, any, any>[] = [
];

export const scoreData: Score<any, any>[] = [
  new Score<number, LineObj>({
    score_id: 1,
    obj_id_list:  [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
    get_attribute: (obj: LineObj) => att_funcs.get_length(obj),
    transformation: (vals) => {
      let sum: number= 0
      for(let i = 0; i < vals.length; i++) {
        sum += Math.round(vals[i])
      }
      return sum
    }
  })
];

export const controlData: Control[] = [
  new SliderControl<LineObj>({
    id: 1,
    obj_id: 1000,
    range: [0, 10],
    step_size: 0.01,
    set_attribute: att_funcs.set_slope,
    get_attribute: att_funcs.get_slope,
  }),

  new SliderControl<LineObj>({
    id: 2,
    obj_id: 1000,
    range: [0, 10],
    step_size: 0.01,
    set_attribute: att_funcs.set_intercept,
    get_attribute: att_funcs.get_intercept,
  }),



  new SelectControl({
    id: 4,
    selectable: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    isActive: true,
    capacity: 4,
  }),

  new SelectControl({
    id: 5,
    selectable: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    isActive: true,
    capacity: 1,
  }),

];

// const positions = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]);
// const geom = new THREE.BufferGeometry();
// geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

// set a seed for math.random

let line = new LineObj({
  id: 1000,
  start: new Vector2(0, 0),
  end: new Vector2(0, 0),
  line_width: 5,
  color: "white",
});
line = LineObj.set_slope_intercept(line, 0, 0.5, [0, 15]);

export let canvasData: obj[] = [line];

const num_points = 30;
// create a bunch of random points in a line and store it in a list
let points: Vector2[] = [];

for (let i = 0; i < num_points; i++) {
  const point = new Vector2(i / 2, 2 + i / 10 + 3 * Math.random());
  points.push(point);
}

for (let i = 0; i < num_points; i++) {
  canvasData.push(
    new geomobj({
      id: i,
      geom: new THREE.CircleGeometry(0.3, 128),
      position: points[i],
      color: "blue",
    })
  );

  canvasData.push(
    new LineObj({
      id: i + num_points,
      start: points[i],
      end: new Vector2(0, 0),
      line_width: 2,
      color: "red",
    })
  );

  influencesData.push(
    new Influence<any, LineObj, LineObj>({
      influence_id: i,
      master_id: 1000,
      worker_id: i + num_points,
      transformation: (value, worker, master) => {
          const slope = value.y;
          const intercept = value.x;
          const x = worker.start.x;
          const y = worker.start.y;
          let perp_slope = 0;
          if (slope != 0) {
            perp_slope = -1 / slope;
          }
          const b = y - perp_slope * x;
          let new_x = worker.start.x;
          if(slope != 0) {
            new_x = (b - intercept) / (slope - perp_slope);
          }
          const new_y = slope * new_x + intercept;
          return new Vector2(new_x, new_y);
        
      },
      get_attribute: att_funcs.get_slope_intercept,
      set_attribute: att_funcs.set_end_point,
    })
  );
}
