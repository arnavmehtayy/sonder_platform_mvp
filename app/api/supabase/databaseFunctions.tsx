import { db } from '@/app/db/index';
import { states, GeomObj, LineObj, FunctionPlotString, DummyDataStorage, AxisObject, TextGeom } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import { SerializeStateInsert, SerializeStateSelect } from '@/classes/database/Serializtypes';

export async function saveStateToDatabase(stateName: string, state: SerializeStateInsert) {
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
    await tx.delete(LineObj).where(eq(LineObj.stateId, stateId));
    await tx.delete(FunctionPlotString).where(eq(FunctionPlotString.stateId, stateId));
    await tx.delete(DummyDataStorage).where(eq(DummyDataStorage.stateId, stateId));
    await tx.delete(AxisObject).where(eq(AxisObject.stateId, stateId));
    await tx.delete(TextGeom).where(eq(TextGeom.stateId, stateId));

    // Insert vizobjects
    if (state.GeomObjs.length > 0) {
      await tx.insert(GeomObj).values(state.GeomObjs.map(obj => ({ ...obj, stateId })));
    }
    if (state.LineObjs.length > 0) {
      await tx.insert(LineObj).values(state.LineObjs.map(obj => ({ ...obj, stateId })));
    }
    if (state.FunctionPlotStrings.length > 0) {
      await tx.insert(FunctionPlotString).values(state.FunctionPlotStrings.map(obj => ({ ...obj, stateId })));
    }
    if (state.DummyDataStorages.length > 0) {
      await tx.insert(DummyDataStorage).values(state.DummyDataStorages.map(obj => ({ ...obj, stateId })));
    }
    if (state.AxisObjects.length > 0) {
      await tx.insert(AxisObject).values(state.AxisObjects.map(obj => ({ ...obj, stateId })));
    }
    if (state.TextGeoms.length > 0) {
      await tx.insert(TextGeom).values(state.TextGeoms.map(obj => ({ ...obj, stateId })));
    }
  });
}

export async function loadStateFromDatabase(stateName: string): Promise<SerializeStateSelect> {
  const state = await db.transaction(async (tx) => {
    // Fetch the state
    const stateRecord = await tx.select().from(states).where(eq(states.state_name, stateName)).limit(1);
    if (stateRecord.length === 0) {
      throw new Error(`State "${stateName}" not found`);
    }
    const stateId = stateRecord[0].id;

    // Fetch all vizobject data
    const geomObjData = await tx.select().from(GeomObj).where(eq(GeomObj.stateId, stateId));
    const lineObjData = await tx.select().from(LineObj).where(eq(LineObj.stateId, stateId));
    const functionPlotStringData = await tx.select().from(FunctionPlotString).where(eq(FunctionPlotString.stateId, stateId));
    const dummyDataStorageData = await tx.select().from(DummyDataStorage).where(eq(DummyDataStorage.stateId, stateId));
    const axisObjectData = await tx.select().from(AxisObject).where(eq(AxisObject.stateId, stateId));
    const textGeomData = await tx.select().from(TextGeom).where(eq(TextGeom.stateId, stateId));

    // Construct the state object
    const loadedState: SerializeStateSelect = {
      title: stateRecord[0].title,
      camera_zoom: stateRecord[0].camera_zoom || 20,
      GeomObjs: geomObjData,
      LineObjs: lineObjData,
      FunctionPlotStrings: functionPlotStringData,
      DummyDataStorages: dummyDataStorageData,
      AxisObjects: axisObjectData,
      TextGeoms: textGeomData,
    };

    return loadedState;
  });

  return state;
}
