import { OrderItem, State } from "@/app/store";
import { geomobj } from "@/classes/vizobjects/geomobj";
import { SerializeStateInsert, SerializeStateSelect } from "./Serializtypes";
import CoordinateAxis from "@/classes/vizobjects/CoordinateAxis";
import { LineObj } from "../vizobjects/Lineobj";
import FunctionPlotString from "../vizobjects/FunctionPlotString";
import { DummyDataStorage } from "../vizobjects/DummyDataStore";
import TextGeom from "../vizobjects/textgeomObj";
import { SelectControl } from "../Controls/SelectControl";
import { obj } from "../vizobjects/obj";
import { Control } from "../Controls/Control";
import { SliderControlAdvanced } from "../Controls/SliderControlAdv";
import { MultiChoiceClass } from "../Controls/MultiChoiceClass";
import { InputNumber } from "../Controls/InputNumber";
import { TableControl } from "../Controls/TableControl";
import { EnablerControl } from "../Controls/EnablerControl";
import { FunctionScore } from "../Scores/FunctionScore";
import { Score } from "../Scores/Score";

export function serializeState(state: State): SerializeStateInsert {
    const multiChoiceControls = Object.values(state.controls)
    .filter((obj): obj is MultiChoiceClass => obj instanceof MultiChoiceClass)
    .map(control => control.serialize());

    const inputNumberControls = Object.values(state.controls)
    .filter((obj): obj is InputNumber => obj instanceof InputNumber)
    .map(control => control.serialize());

    const tableControls = Object.values(state.controls)
    .filter((obj): obj is TableControl<any> => obj instanceof TableControl)
    .map(control => control.serialize());

    const enablerControls = Object.values(state.controls)
    .filter((obj): obj is EnablerControl => obj instanceof EnablerControl)
    .map(control => control.serialize());

    const functionScores = Object.values(state.scores)
    .filter((obj): obj is FunctionScore => obj instanceof FunctionScore)
    .map(score => score.serialize());

    console.log(multiChoiceControls)
  return {
    title: state.title,
    camera_zoom: state.camera_zoom,
    GeomObjs: Object.values(state.vizobjs)
      .filter((obj) => obj instanceof geomobj)
      .map((obj) => (obj as geomobj).serialize()),
    LineObjs: Object.values(state.vizobjs)
      .filter((obj) => obj instanceof LineObj)
      .map((obj) => (obj as LineObj).serialize()),
    FunctionPlotStrings: Object.values(state.vizobjs)
      .filter((obj) => obj instanceof FunctionPlotString)
      .map((obj) => (obj as FunctionPlotString).serialize()),
    DummyDataStorages: Object.values(state.vizobjs)
      .filter((obj) => obj instanceof DummyDataStorage)
      .map((obj) => (obj as DummyDataStorage<number>).serialize()),
    AxisObjects: Object.values(state.vizobjs)
      .filter((obj) => obj instanceof CoordinateAxis)
      .map((obj) => (obj as CoordinateAxis).serialize()),
    TextGeoms: Object.values(state.vizobjs)
      .filter((obj) => obj instanceof TextGeom)
      .map((obj) => (obj as TextGeom).serialize()),

    SelectControls: Object.values(state.controls)
      .filter((obj) => obj instanceof SelectControl)
      .map((obj) => (obj as SelectControl).serialize()),

    SideBarOrder: Object.values(state.order).map((obj) => ({
      type: obj.type,
      itemId: obj.id
    })),

    SliderControls: Object.values(state.controls)
      .filter((obj) => obj instanceof SliderControlAdvanced)
      .map((obj) => (obj as SliderControlAdvanced<any>).serialize()[0]),


    AttributePairs: Object.values(state.controls)
      .filter((obj) => obj instanceof SliderControlAdvanced)
      .flatMap((obj) => obj.serialize()[1]), // serialize the attrite pairs for the slider control and the input number

    
    MultiChoiceControls: multiChoiceControls.map(([control, options]) => control),
    MultiChoiceOptions: multiChoiceControls.flatMap(([control, options]) => options),

    InputNumberControls: inputNumberControls.map(([control]) => control),
    InputNumberAttributePairs: inputNumberControls.flatMap(([control, pairs]) => pairs),
    
    TableControls: tableControls.map(([control]) => control),
    TableCells: tableControls.flatMap(([_, cells]) => cells),
    EnablerControls: enablerControls,
    FunctionScores: functionScores,
  };
}

export function deserializeState(serializedState: SerializeStateSelect): State {
  const vizobjs: { [key: string]: obj } = {};
  const controls: { [key: string]: Control } = {};
  const scores: { [key: number]: Score<any> } = {};

  if (Array.isArray(serializedState.GeomObjs)) {
    serializedState.GeomObjs.forEach((obj) => {
      vizobjs[obj.objId] = geomobj.deserialize(obj);
    });
  }

  serializedState.LineObjs.forEach((obj) => {
    vizobjs[obj.objId] = LineObj.deserialize(obj);
  });

  serializedState.FunctionPlotStrings.forEach((obj) => {
    vizobjs[obj.objId] = FunctionPlotString.deserialize(obj);
  });

  serializedState.DummyDataStorages.forEach((obj) => {
    vizobjs[obj.objId] = DummyDataStorage.deserialize(obj);
  });

  serializedState.AxisObjects.forEach((obj) => {
    vizobjs[obj.objId] = CoordinateAxis.deserialize(obj);
  });

  serializedState.TextGeoms.forEach((obj) => {
    vizobjs[obj.objId] = TextGeom.deserialize(obj);
  });

  serializedState.SelectControls.forEach((obj) => {
    controls[obj.controlId] = SelectControl.deserialize(obj);
  });

  const order: OrderItem[] = serializedState.SideBarOrder.map((obj) => 
   new OrderItem(obj.type, obj.itemId)
  )

  serializedState.SliderControls.forEach((sliderControl) => {
    const relatedAttributePairs = serializedState.AttributePairs.filter(
      pair => pair.ControlId === sliderControl.controlId
    );
    controls[sliderControl.controlId] = SliderControlAdvanced.deserialize(
      sliderControl,
      relatedAttributePairs
    );
  });
  serializedState.MultiChoiceControls.forEach((control) => {
    const relatedOptions = serializedState.MultiChoiceOptions.filter(
      option => option.multiChoiceControlId === control.controlId
    );
    controls[control.controlId] = MultiChoiceClass.deserialize(control, relatedOptions);
  });

  serializedState.InputNumberControls.forEach((control) => {
    const relatedAttributePairs = serializedState.InputNumberAttributePairs.filter(
      pair => pair.ControlId === control.controlId
    );
    controls[control.controlId] = InputNumber.deserialize(control, relatedAttributePairs);
  });

  // Deserialize Table controls
  serializedState.TableControls.forEach((control) => {
    const relatedCells = serializedState.TableCells.filter(
      cell => cell.tableControlId === control.controlId
    );
    controls[control.controlId] = TableControl.deserialize(control, relatedCells);
  });

  // Deserialize Enabler controls
  serializedState.EnablerControls.forEach((control) => {
    controls[control.controlId] = EnablerControl.deserialize(control);
  });

  // Deserialize function scores
  serializedState.FunctionScores.forEach((score) => {
    scores[score.scoreId] = FunctionScore.deserialize(score);
  });

  return {
    title: serializedState.title,
    camera_zoom: serializedState.camera_zoom,
    vizobjs: vizobjs,
    controls: controls,
    order: order,
    scores: scores,
    // questions: [],
    // order: [],
    // validations: [],
    // state_name: '',
    // // Add other required properties with default values
    // influences: [],
    // controls: [],
    // scores: [],
    // placements: [],
    // // ... add any other missing properties
  } as State;
}
