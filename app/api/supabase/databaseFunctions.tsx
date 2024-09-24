import { db } from '@/app/db/index';
import { states, questions, orders, vizobjects, controls, influences, scores, placements, validations } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

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
    await tx.delete(questions).where(eq(questions.stateId, stateId));
    await tx.delete(orders).where(eq(orders.stateId, stateId));
    await tx.delete(vizobjects).where(eq(vizobjects.stateId, stateId));
    await tx.delete(controls).where(eq(controls.stateId, stateId));
    await tx.delete(influences).where(eq(influences.stateId, stateId));
    await tx.delete(scores).where(eq(scores.stateId, stateId));
    await tx.delete(placements).where(eq(placements.stateId, stateId));
    await tx.delete(validations).where(eq(validations.stateId, stateId));

    // Insert questions
    // Insert questions
    if (state.questions && Object.keys(state.questions).length > 0) {
        await tx.insert(questions).values(
          Object.entries(state.questions).map(([id, text]) => ({
            stateId,
            questionId: parseInt(id),
            questionText: text as string
          }))
        );
      }
  
      // Insert orders
      if (state.order && state.order.length > 0) {
        await tx.insert(orders).values(
          state.order.map((item: any) => ({
            stateId,
            type: item.type,
            itemId: item.id
          }))
        );
      }
  
      // Insert vizobjects
      if (state.vizobjs && Object.keys(state.vizobjs).length > 0) {
        await tx.insert(vizobjects).values(
          Object.values(state.vizobjs).map((obj: any) => ({
            stateId,
            objId: obj.id,
            objData: obj,
            constructor: obj.constructor?.name || 'Unknown'
          }))
        );
      }
  
      // Insert controls
      if (state.controls && Object.keys(state.controls).length > 0) {
        await tx.insert(controls).values(
          Object.values(state.controls).map((control: any) => ({
            stateId,
            controlId: control.id,
            controlData: control,
            constructor: control.constructor?.name || 'Unknown'
          }))
        );
      }
  
      // Insert influences
      if (state.influences && Object.keys(state.influences).length > 0) {
        const influenceValues = Object.entries(state.influences).flatMap(([masterId, influenceList]) => {
          if (Array.isArray(influenceList) && influenceList.length > 0) {
            return influenceList.map((influence: any) => ({
              stateId,
              masterId: parseInt(masterId),
              influenceData: influence,
              constructor: influence.constructor?.name || 'Unknown'
            }));
          }
          return [];
        });
        if (influenceValues.length > 0) {
          await tx.insert(influences).values(influenceValues);
        }
      }
  
      // Insert scores
      if (state.scores && Object.keys(state.scores).length > 0) {
        await tx.insert(scores).values(
          Object.values(state.scores).map((score: any) => ({
            stateId,
            scoreId: score.score_id,
            scoreData: score,
            constructor: score.constructor?.name || 'Unknown'
          }))
        );
      }
  
      // Insert placements
      if (state.placement && Object.keys(state.placement).length > 0) {
        await tx.insert(placements).values(
          Object.values(state.placement).map((placement: any) => ({
            stateId,
            placementId: placement.id,
            placementData: placement,
            constructor: placement.constructor?.name || 'Unknown'
          }))
        );
      }
  
      // Insert validations
      if (state.validations && state.validations.length > 0) {
        await tx.insert(validations).values(
          state.validations.map((validation: any) => ({
            stateId,
            validationData: validation,
            constructor: validation.constructor?.name || 'Unknown'
          }))
        );
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

    // Fetch all related data
    const questionsData = await tx.select().from(questions).where(eq(questions.stateId, stateId));
    const ordersData = await tx.select().from(orders).where(eq(orders.stateId, stateId));
    const vizobjectsData = await tx.select().from(vizobjects).where(eq(vizobjects.stateId, stateId));
    const controlsData = await tx.select().from(controls).where(eq(controls.stateId, stateId));
    const influencesData = await tx.select().from(influences).where(eq(influences.stateId, stateId));
    const scoresData = await tx.select().from(scores).where(eq(scores.stateId, stateId));
    const placementsData = await tx.select().from(placements).where(eq(placements.stateId, stateId));
    const validationsData = await tx.select().from(validations).where(eq(validations.stateId, stateId));

    // Construct the state object
    const loadedState: any = {
      camera_zoom: stateRecord[0].camera_zoom || 20.0,
      title: stateRecord[0].title,
      state_name: stateName,
      questions: {},
      order: [],
      validations: [],
      placement: {},
      vizobjs: {},
      controls: {},
      influences: {},
      scores: {},
    };

    // Process questions
    questionsData.forEach(q => {
      if (q.questionId !== null && q.questionText !== null) {
        loadedState.questions[q.questionId] = q.questionText;
      }
    });

    // Process orders
    ordersData.forEach(o => {
      if (o.type !== null && o.itemId !== null) {
        loadedState.order.push({ type: o.type, id: o.itemId });
      }
    });

    // Process vizobjects
    const safeJsonParse = (data: string | null, fallback: any = {}) => {
        if (data === null) return fallback;
        try {
          return JSON.parse(data);
        } catch (error) {
          console.error(`Error parsing JSON: ${error}. Data: ${data}`);
          return fallback;
        }
      };
  
      // Process vizobjects
      vizobjectsData.forEach(v => {
        if (v.objId !== null && v.objData !== null) {
          loadedState.vizobjs[v.objId] = v.objData;
        }
      });
  
      // Process controls
      controlsData.forEach(c => {
        if (c.controlId !== null && c.controlData !== null) {
          loadedState.controls[c.controlId] = c.controlData;
        }
      });
  
      // Process influences
      influencesData.forEach(i => {
        if (i.masterId !== null && i.influenceData !== null) {
          if (!loadedState.influences[i.masterId]) {
            loadedState.influences[i.masterId] = [];
          }
          loadedState.influences[i.masterId].push(i.influenceData);
        }
      });
  
      // Process scores
      scoresData.forEach(s => {
        if (s.scoreId !== null && s.scoreData !== null) {
          loadedState.scores[s.scoreId] = s.scoreData;
        }
      });
  
      // Process placements
      placementsData.forEach(p => {
        if (p.placementId !== null && p.placementData !== null) {
          loadedState.placement[p.placementId] = p.placementData;
        }
      });
  
      // Process validations
      validationsData.forEach(v => {
        if (v.validationData !== null) {
          loadedState.validations.push(v.validationData);
        }
      });

    return loadedState;
  });

  return state;
}
