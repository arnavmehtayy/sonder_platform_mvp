import {obj} from "./obj";

export type DummyDataSupportedTypes = number | string | boolean | number[] | string[] 

export class DummyDataStorage<T extends DummyDataSupportedTypes> extends obj {
    data: T;
    constructor({id, name, data}: {id: number, name: string, data: T}) {
        super({id: id, name: name, isEnabled: true});
        this.data = data;
    }

    static setData<T extends DummyDataSupportedTypes>(obj: DummyDataStorage<T>, data: T): DummyDataStorage<T> {
        const newObj = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
        newObj.data = data;
        return newObj;
    }
}