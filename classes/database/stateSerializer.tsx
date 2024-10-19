import { State } from '@/app/store';
import { geomobj } from '@/classes/vizobjects/geomobj';
import { GeomObjInsert, GeomObjSelect } from '@/app/db/schema';
// Import other serializable object types here
// import { OtherObject, SerializedOtherObject } from '@/classes/otherObject';

export function serializeState(state: State) {
  return {
    ...state,
    vizobjs: Object.fromEntries(
      Object.entries(state.vizobjs).map(([key, obj]) => [
        key,
        obj instanceof geomobj ? obj.serialize() : obj
        // Add similar serialization for other complex objects
        // obj instanceof OtherObject ? obj.serialize() : obj
      ])
    ),
  };
}

export function deserializeState(serializedState: any): State {
  return {
    ...serializedState,
    vizobjs: Object.fromEntries(
      Object.entries(serializedState.vizobjs).map(([key, obj]) => {
        if (obj && typeof obj === 'object') {
          if ('objId' in obj && 'geometry_type' in obj && 'geometry_atts' in obj) {
            // This matches the structure of GeomObjSelect
            return [key, geomobj.deserialize(obj as GeomObjSelect)];
          }
          // Add cases for other serializable object types if needed
        }
        return [key, obj];
      })
    ),
  };
}