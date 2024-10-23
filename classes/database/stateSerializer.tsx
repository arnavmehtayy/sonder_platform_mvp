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

export function serializeState(state: State): SerializeStateInsert {
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
      .flatMap((obj) => (obj as SliderControlAdvanced<any>).serialize()[1])
        
  };
}

export function deserializeState(serializedState: SerializeStateSelect): State {
  const vizobjs: { [key: string]: obj } = {};
  const controls: { [key: string]: Control } = {};
  

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

 

  return {
    title: serializedState.title,
    camera_zoom: serializedState.camera_zoom,
    vizobjs: vizobjs,
    controls: controls,
    order: order
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
