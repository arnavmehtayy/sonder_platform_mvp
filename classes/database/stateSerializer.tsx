import { State } from '@/app/store';
import { geomobj, SerializedGeomObj } from '@/classes/vizobjects/geomobj';

export function serializeState(state: State) {
  return {
    
    ...state,
    vizobjs: Object.fromEntries(
      Object.entries(state.vizobjs).map(([key, obj]) => [
        key,
        obj instanceof geomobj ? obj.serialize() : obj
      ])
    ),
    // Add similar serialization for other complex objects
  };
}

export function deserializeState(serializedState: any): State {
  return {
    ...serializedState,
    vizobjs: Object.fromEntries(
      Object.entries(serializedState.vizobjs).map(([key, obj]) => [
        key,
        geomobj.deserialize(obj as SerializedGeomObj) // change this
      ])
    ),
    // Add similar deserialization for other complex objects
  };
}