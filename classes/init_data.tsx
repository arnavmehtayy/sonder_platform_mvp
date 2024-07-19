import { Vector2, Vector3 } from "three";
import * as att_funcs from "./attribute_funcs";
import { Influence } from "./influence";
import { SliderControl } from "./SliderControl";
import { TouchControl } from "./TouchControl";
import { TransformObj } from "./transformObj";
import * as THREE from "three";
import { SlideContTrans } from "./SliderContTrans";
import { geomobj } from "./geomobj";
import { obj } from "./obj";
import { Control } from "./Control";
import { SelectControl } from "./SelectControl";
import { Score } from "./Score";

/*
 * This file contains the initial data that initializes the store in the app.
 */
// (obj, value) => att_funcs.set_position(obj, new Vector2(5 * Math.cos(value.x), 5 * Math.sin(value.y)))
export const scoreData: Score<any, any>[] = [];

export const influencesData: Influence<
  any,
  any,
  any
>[] = [
  new Influence<[Vector3, Vector2], TransformObj, TransformObj>({
    influence_id: 1,
    master_id: 2,
    worker_id: 1,
    transformation: (value, worker, master) => value,
    get_attribute: (obj) => [att_funcs.get_rotation(obj), att_funcs.get_position(obj)],
    set_attribute: (obj, value) => {
      return att_funcs.set_position(
        obj,
        new Vector2(10 * Math.cos(value[0].z) + value[1].x, 10 * Math.sin(value[0].z) + value[1].y)
      );
    },
  }),

];

export const controlData: Control[] = [
  new SlideContTrans<geomobj>({
    id: 1,
    obj_id: 2,
    action: "rotate",
    range: [0, 7],
    step_size: 0.01,
  }),

  new SlideContTrans<geomobj>({
    id: 2,
    obj_id: 1,
    action: "move",
    range: [-2, 2],
    step_size: 0.25,
  }),
  new SelectControl(
    {
      id: 4,
      selectable: [1, 2],
      isActive: true
    }
  )

];

export const canvasData: obj[] = [
  new geomobj({
    id: 1,
    geom: new THREE.PlaneGeometry(4, 4),
    position: new THREE.Vector2(8, 0),
    color: "green",
    isClickable: true,
    touch_controls: new TouchControl({
      translate: {
        direction: [true, true, false],
        range: [-10, 10],
        step_size: 1,
      },
    }),
  }),

  new geomobj({
    id: 2,
    isClickable: true,
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
