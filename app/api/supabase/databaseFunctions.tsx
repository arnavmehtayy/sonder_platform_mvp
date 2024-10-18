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
import { geomobj, SerializedGeomObj } from '@/classes/vizobjects/geomobj';
import * as THREE from 'three';
import { TouchControl } from '@/classes/Controls/TouchControl';


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

    // Insert questions
    // if (state.questions && Object.keys(state.questions).length > 0) {
    //     await tx.insert(questions).values(
    //       Object.entries(state.questions).map(([id, text]) => ({
    //         stateId,
    //         questionId: parseInt(id),
    //         questionText: text as string
    //       }))
    //     );
    //   }
  
    //   // Insert orders
    //   if (state.order && state.order.length > 0) {
    //     await tx.insert(orders).values(
    //       state.order.map((item: any) => ({
    //         stateId,
    //         type: item.type,
    //         itemId: item.id
    //       }))
    //     );
    //   }
  
      // Insert vizobjects
      
      if (state.vizobjs && Object.keys(state.vizobjs).length > 0) {
        const geomObjValues = Object.values(state.vizobjs)
          .filter((obj): obj is SerializedGeomObj => (obj as SerializedGeomObj).type === "GeomObj")
          .map((obj) => ({
            stateId,
            objId: obj.id,
            name: obj.name,
            color: obj.color,
            position_x: obj.position.x,
            position_y: obj.position.y,
            rotation_x: obj.rotation.x,
            rotation_y: obj.rotation.y,
            rotation_z: obj.rotation.z,
            scale_x: obj.scale.x,
            scale_y: obj.scale.y,
            scale_z: obj.scale.z,
            touch_controls: obj.touch_controls,
            geom_atts_json: obj.geom_json,
          }));

        if (geomObjValues.length > 0) {
          await tx.insert(GeomObj).values(geomObjValues);
        }
      }
  
      // Insert controls
    //   if (state.controls && Object.keys(state.controls).length > 0) {
    //     await tx.insert(controls).values(
    //       Object.values(state.controls).map((control: Control) => ({
    //         stateId,
    //         controlId: control.id,
    //         controlData: control.dataBaseSave()
    //       }))
    //     );
    //   }
  
    //   // Insert influences
    //   if (state.influences && Object.keys(state.influences).length > 0) {
    //     const influenceValues = Object.entries(state.influences).flatMap(([masterId, influenceList]) => {
    //       if (Array.isArray(influenceList) && influenceList.length > 0) {
    //         return influenceList.map((influence: Influence<any, any, any>) => ({
    //           stateId,
    //           masterId: parseInt(masterId),
    //           influenceData: influence.dataBaseSave(),
    //         }));
    //       }
    //       return [];
    //     });
    //     if (influenceValues.length > 0) {
    //       await tx.insert(influences).values(influenceValues);
    //     }
    //   }
  
    //   // Insert scores
    //   if (state.scores && Object.keys(state.scores).length > 0) {
    //     await tx.insert(scores).values(
    //       Object.values(state.scores).map((score: Score<any>) => ({
    //         stateId,
    //         scoreId: score.score_id,
    //         scoreData: score.dataBaseSave(),
    //       }))
    //     );
    //   }
  
    //   // Insert placements
    //   if (state.placement && Object.keys(state.placement).length > 0) {
    //     await tx.insert(placements).values(
    //       Object.values(state.placement).map((placement: Placement) => ({
    //         stateId,
    //         placementId: placement.id,
    //         placementData: placement.dataBaseSave(),
    //       }))
    //     );
    //   }
  
    //   // Insert validations
    //   if (state.validations && state.validations.length > 0) {
    //     await tx.insert(validations).values(
    //       state.validations.map((validation: Validation) => ({
    //         stateId,
    //         validationData: validation.dataBaseSave()
    //       }))
    //     );
    //   }
    // });
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
        const geomObjInstance = new geomobj({
          id: obj.objId,
          name: obj.name,
          isEnabled: true, // Assuming default value, adjust if needed
          position: new THREE.Vector2(obj.position_x, obj.position_y),
          rotation: new THREE.Vector3(obj.rotation_x, obj.rotation_y, obj.rotation_z),
          scale: new THREE.Vector3(obj.scale_x, obj.scale_y, obj.scale_z),
          color: obj.color,
          touch_controls: obj.touch_controls as TouchControl, // this needs to change
          geom_json: obj.geom_atts_json,
        });
        loadedState.vizobjs[obj.objId] = geomObjInstance;
      }
    });

    return loadedState;
  });

  return state;
}
