import { action_typ } from "./SliderControl";
import { vizobj } from "./vizobj";
import { Vector2 } from "three";

export class Influence<T> {
  influence_id: number;
  master_id: number;
  worker_id: number;
  action: action_typ;
  get_attribute: (vizobj: vizobj) => T;
  set_attribute: (vizobj: vizobj, value: T) => vizobj;
  transformation: (value: T) => T;

  constructor({
    influence_id,
    master_id,
    worker_id,
    action,
    get_attribute,
    set_attribute,
    transformation,
  }: {
    influence_id: number;
    master_id: number;
    worker_id: number;
    action: action_typ; // dont need
    get_attribute: (vizobj: vizobj) => T;
    set_attribute: (vizobj: vizobj, value: T) => vizobj;
    transformation: (value: T) => T;
  }) {
    this.influence_id = influence_id;
    this.master_id = master_id;
    this.worker_id = worker_id;
    this.action = action;
    this.get_attribute = get_attribute;
    this.set_attribute = set_attribute;
    this.transformation = transformation;
  }

  static UpdateInfluenceManual(
    influence: Influence<any>,
    set_vizobj: (id: number, new_obj: vizobj) => void,
    worker: vizobj,
    val: number
  ) {
    // const value = new Vector2(-8 + val, 0);
    const value = new Vector2(5 * Math.cos(val), 5 * Math.sin(val));
    set_vizobj(influence.worker_id, influence.set_attribute(worker, value));
  }

  static UpdateInfluence(
    influence: Influence<any>,
    set_vizobj: (id: number, new_obj: vizobj) => void,
    master: vizobj,
    worker: vizobj
  ) {
    // console.log("Updating influence");

    const value = influence.transformation(influence.get_attribute(master));
    set_vizobj(influence.worker_id, influence.set_attribute(worker, value));
  }
}
