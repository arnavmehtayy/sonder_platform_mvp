import { action_typ } from "./SliderControl";

export class Influence {
  influence_id: number;
  master_id: number;
  worker_id: number;
  action: action_typ;
  get_attribute: () => number;
  set_attribute: (value: number) => void;
  transformation: (value: number) => number;

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
    get_attribute: () => number;
    set_attribute: (value: number) => void;
    transformation: (value: number) => number;
  }) {
    this.influence_id = influence_id;
    this.master_id = master_id;
    this.worker_id = worker_id;
    this.action = action;
    this.get_attribute = get_attribute;
    this.set_attribute = set_attribute;
    this.transformation = transformation;
  }

  static UpdateInfluence(influence: Influence) {
    influence.set_attribute(influence.get_attribute());
  }
}
