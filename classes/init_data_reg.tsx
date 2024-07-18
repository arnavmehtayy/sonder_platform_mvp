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

/*
 * This file contains the initial data that initializes the store in the app.
 */
// (obj, value) => att_funcs.set_position(obj, new Vector2(5 * Math.cos(value.x), 5 * Math.sin(value.y)))
export const influencesData: Influence<any, any, any>[] = [];

export const controlData: SliderControl<any>[] = [
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
