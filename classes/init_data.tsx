import { Influence } from "./influence";
import { ControlObj } from "./ControlObj";
import { vizobj } from "./vizobj";
import * as THREE from "three";

/*
 * This file contains the initial data that initializes the store in the app.
 */

export const influencesData: Influence[] = [
  new Influence({
    influence_id: 1,
    master_id: 2,
    worker_id: 1,
    action: "rotate",
    transformation: (value) => value,
  }),
  new Influence({
    influence_id: 2,
    master_id: 1,
    worker_id: 2,
    action: "move",
    transformation: (value) => value,
  }),
];

export const controlData: ControlObj[] = [
  new ControlObj({
    id: 1,
    obj_id: 2,
    action: "scale",
    range: [1, 10],
    step_size: 1,
  }),

  new ControlObj({
    id: 3,
    obj_id: 1,
    action: "move",
    range: [-10, 10],
    step_size: 2,
  }),
];

export const canvasData: vizobj[] = [
  new vizobj(
    1,
    new THREE.Vector2(-10, 2),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 1, 1),
    new THREE.PlaneGeometry(4, 4),
    "green"
  ),
  new vizobj(
    2,
    new THREE.Vector2(2, 2),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 1, 1),
    new THREE.PlaneGeometry(4, 4),
    "red"
  ),
];
