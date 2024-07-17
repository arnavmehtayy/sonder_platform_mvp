import { Vector2, Vector3 } from "three";
import * as att_funcs from "./attribute_funcs";
import { Influence } from "./influence";
import { SliderControl } from "./SliderControl";
import { TouchControl } from "./TouchControl";
import { vizobj } from "./vizobj";
import * as THREE from "three";

/*
 * This file contains the initial data that initializes the store in the app.
 */
// (obj, value) => att_funcs.set_position(obj, new Vector2(5 * Math.cos(value.x), 5 * Math.sin(value.y)))
export const influencesData: Influence<any>[] = [
  new Influence<Vector3>({
    influence_id: 1,
    master_id: 2,
    worker_id: 1,
    transformation: (value, worker, master) => value,
    get_attribute: att_funcs.get_rotation,
    set_attribute: (obj: vizobj, value: Vector3) => {
      return att_funcs.set_position(
        obj,
        new Vector2(10 * Math.cos(value.z), 10 * Math.sin(value.z))
      );
    },
  }),
  //   new Influence({
  //     influence_id: 2,
  //     master_id: 1,
  //     worker_id: 2,
  //     action: "move",
  //     transformation: (value) => value,
  //     get_attribute: () => 1,
  //     set_attribute: (value) => value,
  //   }),
];

export const controlData: SliderControl[] = [
  new SliderControl({
    id: 1,
    obj_id: 2,
    action: "rotate",
    range: [0, 7],
    step_size: 0.1,
  }),

  new SliderControl({
    id: 3,
    obj_id: 1,
    action: "move",
    range: [-2, 2],
    step_size: 0.25,
  }),
];

export const canvasData: vizobj[] = [
  new vizobj({
    id: 1,
    geom: new THREE.PlaneGeometry(4, 4),
    color: "green",
    touch_controls: new TouchControl({
      translate: {
        direction: [true, true, false],
        range: [-10, 10],
        step_size: 1,
      },
    }),
  }),

  new vizobj({
    id: 2,
    geom: new THREE.PlaneGeometry(4, 4),
    position: new THREE.Vector2(0, 0),
    color: "red",
    touch_controls: new TouchControl({
      translate: {
        direction: [true, true, false],
        range: [1, 10],
        step_size: 1,
      },
    }),
  }),
];
