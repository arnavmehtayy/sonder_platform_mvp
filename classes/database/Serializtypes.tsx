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
  InputNumberControlInsert,
  InputNumberControlSelect,
  InputNumberAttributePairsInsert,
  InputNumberAttributePairsSelect,
  TableControlInsert,
  TableControlSelect,
  TableCellInsert,
  TableCellSelect,
  EnablerControlInsert,
  EnablerControlSelect,
  FunctionScoreInsert,
  FunctionScoreSelect,
  ValidationObjInsert,
  ValidationTableControlInsert,
  ValidationScoreInsert,
  ValidationSliderInsert,
  ValidationSelectInsert,
  ValidationObjSelect,
  ValidationScoreSelect,
  ValidationSliderSelect,
  ValidationTableControlSelect,
  ValidationSelectSelect,
  PlacementInsert,
  PlacementSelect,
  QuestionTextInsert,
  QuestionTextSelect
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
  FunctionScores: Omit<FunctionScoreInsert, 'stateId'>[];

  // controls
  SelectControls: Omit<SelectControlInsert, "stateId">[];
  SliderControls: Omit<SliderControlAdvancedInsert, "stateId">[];
  AttributePairs: Omit<AttributePairsInsert, "stateId">[];
  MultiChoiceControls: Omit<MultiChoiceControlInsert, "stateId">[];
  MultiChoiceOptions: Omit<MultiChoiceOptionInsert, "stateId">[];
  InputNumberControls: Omit<InputNumberControlInsert, "stateId">[];
  InputNumberAttributePairs: Omit<InputNumberAttributePairsInsert, "stateId">[];

  SideBarOrder: Omit<OrderInsert, "stateId">[];
  TableControls: Omit<TableControlInsert, 'stateId'>[];
  TableCells: Omit<TableCellInsert, 'stateId'>[];
  EnablerControls: Omit<EnablerControlInsert, 'stateId'>[];
  
  // Add validations
  ValidationObjs: Omit<ValidationObjInsert, "stateId">[];
  ValidationTableControls: Omit<ValidationTableControlInsert, "stateId">[];
  ValidationScores: Omit<ValidationScoreInsert, "stateId">[];
  ValidationSliders: Omit<ValidationSliderInsert, "stateId">[];
  ValidationSelects: Omit<ValidationSelectInsert, "stateId">[];
  Placements: Omit<PlacementInsert, "stateId">[];
  Questions: Omit<QuestionTextInsert, "stateId">[];
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
  FunctionScores: FunctionScoreSelect[];

  // controls
  SliderControls: SliderControlAdvancedSelect[];
  SelectControls: SelectControlSelect[];
  AttributePairs: AttributePairsSelect[];
  MultiChoiceControls: MultiChoiceControlSelect[];
  MultiChoiceOptions: MultiChoiceOptionSelect[];
  InputNumberControls: InputNumberControlSelect[];
  InputNumberAttributePairs: InputNumberAttributePairsSelect[];

  SideBarOrder: OrderSelect[];
  TableControls: TableControlSelect[];
  TableCells: TableCellSelect[];
  EnablerControls: EnablerControlSelect[];
  
  // Add validations
  ValidationObjs: ValidationObjSelect[];
  ValidationTableControls: ValidationTableControlSelect[];
  ValidationScores: ValidationScoreSelect[];
  ValidationSliders: ValidationSliderSelect[];
  ValidationSelects: ValidationSelectSelect[];
  Placements: PlacementSelect[];
  Questions: QuestionTextSelect[];
}
