import { action_typ } from "./SliderControl";
import { vizobj } from "./vizobj";
import { Vector2 } from "three";

export class Influence<T> {
  influence_id: number;
  master_id: number;
  worker_id: number;
  get_attribute: (vizobj: vizobj) => T;
  set_attribute: (vizobj: vizobj, value: T) => vizobj;
  transformation: (value: T, worker: vizobj, master: vizobj) => T;

  constructor({
    influence_id,
    master_id,
    worker_id,
    get_attribute,
    set_attribute,
    transformation,
  }: {
    influence_id: number;
    master_id: number;
    worker_id: number;
    get_attribute: (vizobj: vizobj) => T;
    set_attribute: (vizobj: vizobj, value: T) => vizobj;
    transformation: (value: T, worker: vizobj, master: vizobj) => T;
  }) {
    this.influence_id = influence_id;
    this.master_id = master_id;
    this.worker_id = worker_id;
    this.get_attribute = get_attribute;
    this.set_attribute = set_attribute;
    this.transformation = transformation;
  }

  static UpdateInfluence(influence: Influence<any>, master: vizobj, worker: vizobj) {
    const value = influence.transformation(
      influence.get_attribute(master),
      worker,
      master
    );
    return influence.set_attribute(
      worker,
      value
    );
  }
}
