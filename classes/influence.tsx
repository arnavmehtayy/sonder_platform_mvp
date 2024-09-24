import { obj } from "./vizobjects/obj";


/*
 * This class is responsible for storing information about an influence that is to be computed
  * the attributes of this class are: influence_id, 
  * master_id: the id of the object that is the master object (the object that influences the worker object)
  * worker_id: the id of the object that is the worker object (the object that is influenced by the master object)
  * get_attribute: function that gets the attribute of the master object
  * set_attribute: function that sets the attribute of the worker object
  * transformation: function that takes the attribute of the master object and computes the attribute of the worker object
*/

export interface InfluenceConstructor<T, master_T extends obj, worker_T extends obj> {
  influence_id: number;
  master_id: number;
  worker_id: number;
  get_attribute: (vizobj: master_T) => T;
  set_attribute: (vizobj: worker_T, value: T) => worker_T;
  transformation: (value: T, worker: worker_T, master: master_T) => T;
}

export class Influence<T, master_T extends obj, worker_T extends obj> {
  influence_id: number;
  master_id: number; // the id of the object that is the influencer
  worker_id: number; // the id of the object that is being influenced
  get_attribute: (vizobj: master_T) => T; // function that gets the attribute of the master object
  set_attribute: (vizobj: worker_T, value: T) => worker_T; // function that sets the attribute of the worker object
  transformation: (value: T, worker: worker_T, master: master_T) => T;

  constructor({
    influence_id,
    master_id,
    worker_id,
    get_attribute,
    set_attribute,
    transformation,
  }: InfluenceConstructor<T, master_T, worker_T>) {
    this.influence_id = influence_id;
    this.master_id = master_id;
    this.worker_id = worker_id;
    this.get_attribute = get_attribute;
    this.set_attribute = set_attribute;
    this.transformation = transformation;
  }

 // given the worker and master objects this method updates the attribute of the worker object based on the attribute of the master object
 // this is used by the storage system
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

  dataBaseSave(): InfluenceConstructor<T, master_T, worker_T> & {type: string} {
    return {
      influence_id: this.influence_id,
      master_id: this.master_id,
      worker_id: this.worker_id,
      get_attribute: this.get_attribute,
      set_attribute: this.set_attribute,
      transformation: this.transformation,
      type: "influence"
    };
  }
}
