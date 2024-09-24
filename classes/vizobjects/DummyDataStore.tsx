import { obj } from "../vizobjects/obj";

/*
 * this is a invisible object on the scene that stores some data
 * this can be used to store intermediate that needs to be used by other objects (think of them as intermediate computations)
*/
export type DummyDataSupportedTypes =
  | number
  | string
  | boolean
  | number[]
  | string[];


interface DummyDataStorageConstructor<T extends DummyDataSupportedTypes> {
  id: number;
  name: string;
  data: T;
}

export class DummyDataStorage<T extends DummyDataSupportedTypes> extends obj {
  data: T;
  constructor({ id, name, data }: DummyDataStorageConstructor<T>) {
    super({ id: id, name: name, isEnabled: true });
    this.data = data;
  }

  // method to set the data for this data storage object
  // used by the storage system
  static setData<T extends DummyDataSupportedTypes>(
    obj: DummyDataStorage<T>,
    data: T
    
  ): DummyDataStorage<T> {
    const newObj = Object.assign(
      Object.create(Object.getPrototypeOf(obj)),
      obj
    );
    newObj.data = data;
    return newObj;
  }

  dataBaseSave(): DummyDataStorageConstructor<T> & {type: string} {
    return {
      id: this.id,
      name: this.name,
      data: this.data,
      type: 'DummyDataStorage'
    };
  }
}
