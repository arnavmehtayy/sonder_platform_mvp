import { action_typ } from "./SliderControl";

export class Influence {
  influence_id: number;
  master_id: number;
  worker_id: number;
  action: action_typ;
  transformation: (value: number) => number;

  constructor(options: {
    influence_id: number;
    master_id: number;
    worker_id: number;
    action: action_typ;
    transformation: (value: number) => number;
  }) {
    this.master_id = options.master_id;
    this.worker_id = options.worker_id;
    this.action = options.action;
    this.influence_id = options.influence_id;
    this.transformation = options.transformation;
  }
}
