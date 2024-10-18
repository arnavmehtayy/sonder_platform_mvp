import { db } from '@/app/db/index';
import { states, GeomObj } from '@/app/db/schema';
import { State } from '@/app/store';
import { Control } from '@/classes/Controls/Control';
import { Influence } from '@/classes/influence';
import { obj } from '@/classes/vizobjects/obj';
import { eq } from 'drizzle-orm';
import { Score } from '@/classes/Scores/Score';
import Placement from '@/classes/Placement';
import Validation from '@/classes/Validation/Validation';
import { geomobj, PredefinedGeometry } from '@/classes/vizobjects/geomobj';
import { SerializedGeomObj } from '@/classes/database/Serializtypes';
import * as THREE from 'three';
import { TouchControl, TouchControlAttributes } from '@/classes/Controls/TouchControl';

export async function saveStateToDatabase(stateName: string, state: any) {
  await db.transaction(async (tx) => {
    // Check if the state already exists
    const existingState = await tx.select().from(states).where(eq(states.state_name, stateName)).limit(1);

    let stateId: number;

    if (existingState.length > 0) {
      // Update existing state
      await tx.update(states)
        .set({
          camera_zoom: state.camera_zoom,
          title: state.title,
          updatedAt: new Date()
        })
        .where(eq(states.state_name, stateName));
      stateId = existingState[0].id;
    } else {
      // Insert new state
      const [insertedState] = await tx.insert(states).values({
        state_name: stateName,
        camera_zoom: state.camera_zoom,
        title: state.title
      }).returning({ id: states.id });
      stateId = insertedState.id;
    }

    // Delete existing related records
    await tx.delete(GeomObj).where(eq(GeomObj.stateId, stateId));

    // Insert vizobjects
    if (state.vizobjs && Object.keys(state.vizobjs).length > 0) {
      const geomObjValues = Object.values(state.vizobjs)
        .filter((obj): obj is SerializedGeomObj => (obj as SerializedGeomObj).type === "GeomObj")
        .map((obj) => ({
          stateId,
          objId: obj.id,
          name: obj.name,
          color: obj.color,
          position_x: obj.position_x,
          position_y: obj.position_y,
          rotation_x: obj.rotation_x,
          rotation_y: obj.rotation_y,
          rotation_z: obj.rotation_z,
          scale_x: obj.scale_x,
          scale_y: obj.scale_y,
          scale_z: obj.scale_z,
          touch_controls: obj.touch_controls,
          geometry_type: obj.geometry_type,
          geometry_atts: obj.geometry_params
        }));

      if (geomObjValues.length > 0) {
        await tx.insert(GeomObj).values(geomObjValues);
      }
    }
  });
}

export async function loadStateFromDatabase(stateName: string): Promise<any> {
  const state = await db.transaction(async (tx) => {
    // Fetch the state
    const stateRecord = await tx.select().from(states).where(eq(states.state_name, stateName)).limit(1);
    if (stateRecord.length === 0) {
      throw new Error(`State "${stateName}" not found`);
    }
    const stateId = stateRecord[0].id;

    // Fetch all geomObj data
    const geomObjData = await tx.select().from(GeomObj).where(eq(GeomObj.stateId, stateId));

    // Construct the state object
    const loadedState: any = {
      camera_zoom: stateRecord[0].camera_zoom || 20.0,
      title: stateRecord[0].title,
      state_name: stateName,
      vizobjs: {},
    };

    // Process geomObj data
    geomObjData.forEach(obj => {
      if (obj.objId !== null) {
        const serializedGeomObj: SerializedGeomObj = {
          id: obj.objId,
          name: obj.name,
          isEnabled: true, // Assuming default value, adjust if needed
          position_x: obj.position_x,
          position_y: obj.position_y,
          rotation_x: obj.rotation_x,
          rotation_y: obj.rotation_y,
          rotation_z: obj.rotation_z,
          scale_x: obj.scale_x,
          scale_y: obj.scale_y,
          scale_z: obj.scale_z,
          color: obj.color,
          touch_controls: obj.touch_controls as TouchControl,
          geometry_type: obj.geometry_type,
          geometry_params: obj.geometry_atts,
          type: "GeomObj"
        };
        loadedState.vizobjs[obj.objId] = serializedGeomObj;
      }
    });

    return loadedState;
  });

  return state;
}
