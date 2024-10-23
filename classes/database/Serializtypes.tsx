import {
  AxisObjectInsert,
  DummyDataStorageInsert,
  FunctionPlotStringInsert,
  GeomObjInsert,
  LineObjInsert,
  TextGeomInsert,
  AxisObjectSelect,
  DummyDataStorageSelect,
  FunctionPlotStringSelect,
  GeomObjSelect,
  LineObjSelect,
  TextGeomSelect,
  SelectControlInsert,
  SelectControlSelect,
  OrderInsert,
  OrderSelect,
  SliderControlAdvancedInsert,
  SliderControlAdvancedSelect,
  AttributePairsInsert,
  AttributePairsSelect,
  MultiChoiceControlInsert,
  MultiChoiceControlSelect,
  MultiChoiceOptionInsert,
  MultiChoiceOptionSelect,
} from "@/app/db/schema";

export interface SerializeStateInsert {
  title: string;
  camera_zoom: number;
  // vizobjects
  GeomObjs: Omit<GeomObjInsert, "stateId">[];
  LineObjs: Omit<LineObjInsert, "stateId">[];
  FunctionPlotStrings: Omit<FunctionPlotStringInsert, "stateId">[];
  DummyDataStorages: Omit<DummyDataStorageInsert, "stateId">[];
  AxisObjects: Omit<AxisObjectInsert, "stateId">[];
  TextGeoms: Omit<TextGeomInsert, "stateId">[];

  // controls
  SelectControls: Omit<SelectControlInsert, "stateId">[];
  SliderControls: Omit<SliderControlAdvancedInsert, "stateId">[];
  AttributePairs: Omit<AttributePairsInsert, "stateId">[];
  MultiChoiceControls: Omit<MultiChoiceControlInsert, "stateId">[];
  MultiChoiceOptions: Omit<MultiChoiceOptionInsert, "stateId">[];

  SideBarOrder: Omit<OrderInsert, "stateId">[];
}

export interface SerializeStateSelect {
  title: string;
  camera_zoom: number;
  // vizobjects
  GeomObjs: GeomObjSelect[];
  LineObjs: LineObjSelect[];
  FunctionPlotStrings: FunctionPlotStringSelect[];
  DummyDataStorages: DummyDataStorageSelect[];
  AxisObjects: AxisObjectSelect[];
  TextGeoms: TextGeomSelect[];

  // controls
  SliderControls: SliderControlAdvancedSelect[];
  SelectControls: SelectControlSelect[];
  AttributePairs: AttributePairsSelect[];
  MultiChoiceControls: MultiChoiceControlSelect[];
  MultiChoiceOptions: MultiChoiceOptionSelect[];

  SideBarOrder: OrderSelect[];
}
