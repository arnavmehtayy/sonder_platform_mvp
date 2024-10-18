import { State } from '@/app/store';
import { geomobj } from '@/classes/vizobjects/geomobj';
import { SerializedGeomObj } from './Serializtypes';
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

        if (obj && typeof obj === 'object' && 'type' in obj) {
          switch (obj.type) {
            case 'GeomObj':
              return [key, geomobj.deserialize(obj as SerializedGeomObj)];
            // Add cases for other serializable object types
            // case 'OtherObject':
            //   return [key, OtherObject.deserialize(obj as SerializedOtherObject)];
            default:
              console.warn(`Unknown object type: ${obj.type}`);
              return [key, obj];
          }
        }
        return [key, obj];
      })
    ),
  };
}