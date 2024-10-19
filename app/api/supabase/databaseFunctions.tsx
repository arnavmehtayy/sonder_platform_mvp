import { db } from '@/app/db/index';
import { states, GeomObj, GeomObjInsert } from '@/app/db/schema';
import { State } from '@/app/store';
import { Control } from '@/classes/Controls/Control';
import { Influence } from '@/classes/influence';
import { obj } from '@/classes/vizobjects/obj';
import { eq } from 'drizzle-orm';
import { Score } from '@/classes/Scores/Score';
import Placement from '@/classes/Placement';
import Validation from '@/classes/Validation/Validation';
import { geomobj, PredefinedGeometry } from '@/classes/vizobjects/geomobj';
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
      const geomObjValues = (Object.values(state.vizobjs) as  Omit<GeomObjInsert, 'stateId'>[])
        .filter((obj) => 'geometry_type' in obj)
        .map((obj) => ({
          stateId,
          ...obj
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
        loadedState.vizobjs[obj.objId] = obj;
      }
    });

    return loadedState;
  });

  return state;
}
