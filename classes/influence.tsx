import { obj } from "./vizobjects/obj";
import { TransformObj } from "./vizobjects/transformObj";
import { Vector2 } from "three";

export class Influence<T, master_T extends obj, worker_T extends obj> {
  influence_id: number;
  master_id: number;
  worker_id: number;
  get_attribute: (vizobj: master_T) => T;
  set_attribute: (vizobj: worker_T, value: T) => worker_T;
  transformation: (value: T, worker: worker_T, master: master_T) => T;

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
    get_attribute: (vizobj: master_T) => T;
    set_attribute: (vizobj: worker_T, value: T) => worker_T;
    transformation: (value: T, worker: worker_T, master: master_T) => T;
  }) {
    this.influence_id = influence_id;
    this.master_id = master_id;
    this.worker_id = worker_id;
    this.get_attribute = get_attribute;
    this.set_attribute = set_attribute;
    this.transformation = transformation;
  }

  static UpdateInfluence<T, master_T extends obj, worker_T extends obj>(
    influence: Influence<T, master_T, worker_T>,
    master: master_T,
    worker: worker_T
  ) {
    const value = influence.transformation(
      influence.get_attribute(master),
      worker,
      master
    );
    return influence.set_attribute(worker, value);
  }
}
