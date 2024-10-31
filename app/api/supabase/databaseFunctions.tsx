import { db } from "@/app/db/index";
import {
  states,
  GeomObj,
  LineObj,
  FunctionPlotString,
  DummyDataStorage,
  AxisObject,
  TextGeom,
  SelectControl,
  order,
  SliderControlAdvanced,
  AttributePairs,
  MultiChoiceOption,
  MultiChoiceControl,
  InputNumberAttributePairs,
  TableControl,
  TableCell,
  EnablerControl,
  FunctionScore,
  ValidationObj,
  ValidationTableControl,
  ValidationScore,
  ValidationSlider,
  ValidationSelect,
  Placement,
  Questions_text,
  experience,
} from "@/app/db/schema";
import { eq } from "drizzle-orm";
import {
  SerializeStateInsert,
  SerializeStateSelect,
} from "@/classes/database/Serializtypes";

import { InputNumberControl } from '@/app/db/schema';
import { and } from "drizzle-orm";


export async function saveStateToDatabase(
  experienceId: number,
  profileId: number,
  state: SerializeStateInsert,
  exp_desc: string,
  exp_title: string,
  index: number,
) {
  await db.transaction(async (tx) => {
    let stateId: number;
    let expId = experienceId;


    // Check if experience exists
    const existingExperience = await tx
      .select()
      .from(experience)
      .where(eq(experience.id, experienceId))
      .limit(1);

    if (existingExperience.length === 0) {
      // Create new experience if it doesn't exist
      const [insertedExperience] = await tx
        .insert(experience)
        .values({
          desc: exp_desc,
          title: exp_title,
          user_id: profileId
        })
        .returning({ id: experience.id });
      expId = insertedExperience.id;
    }

    // Check if state exists for this experience and index
    const existingState = await tx
      .select()
      .from(states)
      .where(
        and(eq(states.experienceId, expId), eq(states.index, index))
      )
      .limit(1);


    if (existingState.length > 0) {
      // Update existing state
      await tx
        .update(states)
        .set({
          camera_zoom: state.camera_zoom,
          title: state.title,
          updatedAt: new Date(),
        })
        .where(eq(states.id, existingState[0].id));
      stateId = existingState[0].id;

      await tx.delete(GeomObj).where(eq(GeomObj.stateId, stateId));
    await tx.delete(LineObj).where(eq(LineObj.stateId, stateId));
    await tx
      .delete(FunctionPlotString)
      .where(eq(FunctionPlotString.stateId, stateId));
    await tx
      .delete(DummyDataStorage)
      .where(eq(DummyDataStorage.stateId, stateId));
    await tx.delete(AxisObject).where(eq(AxisObject.stateId, stateId));
    await tx.delete(TextGeom).where(eq(TextGeom.stateId, stateId));
    await tx.delete(SelectControl).where(eq(SelectControl.stateId, stateId));
    await tx
      .delete(SliderControlAdvanced)
      .where(eq(SliderControlAdvanced.stateId, stateId));
    await tx.delete(AttributePairs).where(eq(AttributePairs.stateId, stateId));
    await tx.delete(order).where(eq(order.stateId, stateId));
    await tx
      .delete(MultiChoiceOption)
      .where(eq(MultiChoiceOption.stateId, stateId));
    await tx
      .delete(MultiChoiceControl)
      .where(eq(MultiChoiceControl.stateId, stateId));
    
    await tx.delete(InputNumberAttributePairs).where(eq(InputNumberAttributePairs.stateId, stateId));
    await tx.delete(InputNumberControl).where(eq(InputNumberControl.stateId, stateId));

    // Delete existing Enabler records
    await tx.delete(EnablerControl).where(eq(EnablerControl.stateId, stateId));

    // Delete existing Table records
    await tx.delete(TableCell).where(eq(TableCell.stateId, stateId));
    await tx.delete(TableControl).where(eq(TableControl.stateId, stateId));

    // Delete existing FunctionScore records
    await tx.delete(FunctionScore).where(eq(FunctionScore.stateId, stateId));

    // Delete existing validation records
    await tx.delete(ValidationObj).where(eq(ValidationObj.stateId, stateId));
    await tx.delete(ValidationTableControl).where(eq(ValidationTableControl.stateId, stateId));
    await tx.delete(ValidationScore).where(eq(ValidationScore.stateId, stateId));
    await tx.delete(ValidationSlider).where(eq(ValidationSlider.stateId, stateId));
    await tx.delete(ValidationSelect).where(eq(ValidationSelect.stateId, stateId));

    // Delete existing placement records
    await tx.delete(Placement).where(eq(Placement.stateId, stateId));

    // Delete existing question records
    await tx.delete(Questions_text).where(eq(Questions_text.stateId, stateId));
    } else {
      // Create new state
      const [insertedState] = await tx
        .insert(states)
        .values({
          camera_zoom: state.camera_zoom,
          title: state.title,
          experienceId: expId,
          index: index,
          state_name: Date.now().toString()
        })
        .returning({ id: states.id });
      stateId = insertedState.id;
    }

    // Delete existing related records
    

    // Insert vizobjects
    if (state.GeomObjs.length > 0) {
      await tx
        .insert(GeomObj)
        .values(state.GeomObjs.map((obj) => ({ ...obj, stateId })));
    }
    if (state.LineObjs.length > 0) {
      await tx
        .insert(LineObj)
        .values(state.LineObjs.map((obj) => ({ ...obj, stateId })));
    }
    if (state.FunctionPlotStrings.length > 0) {
      await tx
        .insert(FunctionPlotString)
        .values(state.FunctionPlotStrings.map((obj) => ({ ...obj, stateId })));
    }
    if (state.DummyDataStorages.length > 0) {
      await tx
        .insert(DummyDataStorage)
        .values(state.DummyDataStorages.map((obj) => ({ ...obj, stateId })));
    }
    if (state.AxisObjects.length > 0) {
      await tx
        .insert(AxisObject)
        .values(state.AxisObjects.map((obj) => ({ ...obj, stateId })));
    }
    if (state.TextGeoms.length > 0) {
      await tx
        .insert(TextGeom)
        .values(state.TextGeoms.map((obj) => ({ ...obj, stateId })));
    }
    if (state.SelectControls.length > 0) {
      await tx
        .insert(SelectControl)
        .values(
          state.SelectControls.map((control) => ({ ...control, stateId }))
        );
    }
    if (state.SliderControls.length > 0) {
      await tx
        .insert(SliderControlAdvanced)
        .values(
          state.SliderControls.map((control) => ({ ...control, stateId }))
        );
    }
    if (state.AttributePairs.length > 0) {
      await tx
        .insert(AttributePairs)
        .values(state.AttributePairs.map((pair) => ({ ...pair, stateId })));
    }
    if (state.SideBarOrder.length > 0) {
      await tx
        .insert(order)
        .values(state.SideBarOrder.map((item) => ({ ...item, stateId })));
    }
    if (state.MultiChoiceControls.length > 0) {
      await tx
        .insert(MultiChoiceControl)
        .values(
          state.MultiChoiceControls.map((control) => ({ ...control, stateId }))
        );
    }
    if (state.MultiChoiceOptions.length > 0) {
      await tx
        .insert(MultiChoiceOption)
        .values(
          state.MultiChoiceOptions.map((option) => ({ ...option, stateId }))
        );
    }

    if (state.InputNumberControls.length > 0) {
      const insertedInputNumbers = await tx
        .insert(InputNumberControl)
        .values(state.InputNumberControls.map(control => ({ ...control, stateId })))
        .returning({ id: InputNumberControl.id, controlId: InputNumberControl.controlId });

      // Then insert their attribute pairs
      if (state.InputNumberAttributePairs.length > 0) {
        await tx
          .insert(InputNumberAttributePairs)
          .values(
            state.InputNumberAttributePairs.map(pair => {
              const relatedControl = insertedInputNumbers.find(
                control => control.controlId === pair.ControlId
              );
              return {
                ...pair,
                stateId,
                ControlId: relatedControl?.id || pair.ControlId
              };
            })
          );
      }
    }

    // Insert new Enabler controls
    if (state.EnablerControls.length > 0) {
      await tx.insert(EnablerControl).values(
        state.EnablerControls.map(control => ({ ...control, stateId }))
      );
    }

    // Insert new Table controls and cells
    if (state.TableControls.length > 0) {
      await tx.insert(TableControl).values(
        state.TableControls.map(control => ({ ...control, stateId }))
      );
    }
    if (state.TableCells.length > 0) {
      await tx.insert(TableCell).values(
        state.TableCells.map(cell => ({ ...cell, stateId }))
      );
    }

    // Insert new FunctionScore records
    if (state.FunctionScores.length > 0) {
      await tx.insert(FunctionScore).values(
        state.FunctionScores.map(score => ({ ...score, stateId }))
      );
    }

    // Insert new validation records
    if (state.ValidationObjs.length > 0) {
      await tx.insert(ValidationObj)
        .values(state.ValidationObjs.map(v => ({ ...v, stateId })));
    }
    if (state.ValidationTableControls.length > 0) {
      await tx.insert(ValidationTableControl)
        .values(state.ValidationTableControls.map(v => ({ ...v, stateId })));
    }
    if (state.ValidationScores.length > 0) {
      await tx.insert(ValidationScore)
        .values(state.ValidationScores.map(v => ({ ...v, stateId })));
    }
    if (state.ValidationSliders.length > 0) {
      await tx.insert(ValidationSlider)
        .values(state.ValidationSliders.map(v => ({ ...v, stateId })));
    }
    if (state.ValidationSelects.length > 0) {
      await tx.insert(ValidationSelect)
        .values(state.ValidationSelects.map(v => ({ ...v, stateId })));
    }

    // Insert new placement records
    if (state.Placements.length > 0) {
      await tx.insert(Placement)
        .values(state.Placements.map(p => ({ ...p, stateId })));
    }

    // Insert question records
    if (state.Questions.length > 0) {
      await tx.insert(Questions_text)
        .values(state.Questions.map(q => ({ ...q, stateId })));
    }
  });
}

export async function loadStateFromDatabase(
  experienceId: number,
  index: number,
): Promise<SerializeStateSelect> {
  const state = await db.transaction(async (tx) => {
    // Fetch the state
    const stateRecord = await tx
      .select()
      .from(states)
      .where(
        eq(states.experienceId, experienceId) &&
        eq(states.index, index)
      )
      .limit(1);
    if (stateRecord.length === 0) {
      throw new Error(`State not found for experience ${experienceId} and index ${index}`);
    }
    const stateId = stateRecord[0].id;

    // Fetch all vizobject data
    const geomObjData = await tx
      .select()
      .from(GeomObj)
      .where(eq(GeomObj.stateId, stateId));
    const lineObjData = await tx
      .select()
      .from(LineObj)
      .where(eq(LineObj.stateId, stateId));
    const functionPlotStringData = await tx
      .select()
      .from(FunctionPlotString)
      .where(eq(FunctionPlotString.stateId, stateId));
    const dummyDataStorageData = await tx
      .select()
      .from(DummyDataStorage)
      .where(eq(DummyDataStorage.stateId, stateId));
    const axisObjectData = await tx
      .select()
      .from(AxisObject)
      .where(eq(AxisObject.stateId, stateId));
    const textGeomData = await tx
      .select()
      .from(TextGeom)
      .where(eq(TextGeom.stateId, stateId));
    const selectControlData = await tx
      .select()
      .from(SelectControl)
      .where(eq(SelectControl.stateId, stateId));
    const sliderControlData = await tx
      .select()
      .from(SliderControlAdvanced)
      .where(eq(SliderControlAdvanced.stateId, stateId));
    const attributePairsData = await tx
      .select()
      .from(AttributePairs)
      .where(eq(AttributePairs.stateId, stateId));
    const sideBarOrderData = await tx
      .select()
      .from(order)
      .where(eq(order.stateId, stateId));

    const multiChoiceControlData = await tx
      .select()
      .from(MultiChoiceControl)
      .where(eq(MultiChoiceControl.stateId, stateId));

    const multiChoiceOptionData = await tx
      .select()
      .from(MultiChoiceOption)
      .where(eq(MultiChoiceOption.stateId, stateId));
    
    const inputNumberControlData = await tx
      .select()
      .from(InputNumberControl)
      .where(eq(InputNumberControl.stateId, stateId));

    const inputNumberAttributePairsData = await tx
      .select()
      .from(InputNumberAttributePairs)
      .where(eq(InputNumberAttributePairs.stateId, stateId));

    // Fetch Enabler data
    const enablerControlData = await tx.select()
      .from(EnablerControl)
      .where(eq(EnablerControl.stateId, stateId));

    // Fetch Table data
    const tableControlData = await tx.select()
      .from(TableControl)
      .where(eq(TableControl.stateId, stateId));
    
    const tableCellData = await tx.select()
      .from(TableCell)
      .where(eq(TableCell.stateId, stateId));

    // Fetch FunctionScore data
    const functionScoreData = await tx.select()
      .from(FunctionScore)
      .where(eq(FunctionScore.stateId, stateId));

    // Fetch validation data
    const validationObjData = await tx.select()
      .from(ValidationObj)
      .where(eq(ValidationObj.stateId, stateId));

    const validationTableControlData = await tx.select()
      .from(ValidationTableControl)
      .where(eq(ValidationTableControl.stateId, stateId));

    const validationScoreData = await tx.select()
      .from(ValidationScore)
      .where(eq(ValidationScore.stateId, stateId));

    const validationSliderData = await tx.select()
      .from(ValidationSlider)
      .where(eq(ValidationSlider.stateId, stateId));

    const validationSelectData = await tx.select()
      .from(ValidationSelect)
      .where(eq(ValidationSelect.stateId, stateId));

    const placementData = await tx.select()
      .from(Placement)
      .where(eq(Placement.stateId, stateId));

    // Fetch question data
    const questionData = await tx.select()
      .from(Questions_text)
      .where(eq(Questions_text.stateId, stateId));

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
      SelectControls: selectControlData,
      SliderControls: sliderControlData,
      AttributePairs: attributePairsData,
      SideBarOrder: sideBarOrderData,
      MultiChoiceControls: multiChoiceControlData,
      MultiChoiceOptions: multiChoiceOptionData,
      InputNumberControls: inputNumberControlData,
      InputNumberAttributePairs: inputNumberAttributePairsData,
      TableControls: tableControlData,
      TableCells: tableCellData,
      EnablerControls: enablerControlData,
      FunctionScores: functionScoreData,
      ValidationObjs: validationObjData,
      ValidationTableControls: validationTableControlData,
      ValidationScores: validationScoreData,
      ValidationSliders: validationSliderData,
      ValidationSelects: validationSelectData,
      Placements: placementData,
      Questions: questionData,
    };
    return loadedState;
  });

  return state;
}
