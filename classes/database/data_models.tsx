import { Vector2, Vector3 } from "three";
import { TouchControlAttributes } from "../Controls/TouchControl";
import { DummyDataSupportedTypes } from "../vizobjects/DummyDataStore";
import * as THREE from "three";
import { PredefinedGeometry } from "../vizobjects/geomobj";
import { value_typ, relation, Attribute_get } from "../Validation/Validation_obj";
import { AttributePairSet_json } from "../Controls/SliderControlAdv";
import { TableRow } from "../Controls/TableControl";
import { obj, object_types } from "../vizobjects/obj";
import { Option } from "../Controls/MultiChoiceClass";
import { Validation_types } from "../Validation/Validation";
import { SideBarComponentType } from "@/app/store";
import { AttributePairGet } from "../Controls/FunctionStr";
import { placement_type } from "../Placement";


// ORDER

export interface OrderModel {
  type: SideBarComponentType;
  id: number;
}

// VIZOBJECTS

// Obj
export interface ObjModel {
  isClickable: boolean;
  id: number;
  name: string;
  isEnabled: boolean;
  type: object_types; 
}

// ColoredObj
export interface ColoredObjModel extends ObjModel {
  color: string;
}

// TransformObj
export interface TransformObjModel extends ColoredObjModel {
  position: { x: number; y: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  touch_controls: {
    translate?: TouchControlAttributes;
    rotate?: TouchControlAttributes;
    scale?: TouchControlAttributes;
  };
}

// CoordinateAxis
export interface CoordinateAxisModel extends TransformObjModel {
  axisLength: number;
  tickSpacing: number;
  tickSize: number;
  showLabels: boolean;
  fontSize: number;
  lineWidth: number;
  xLabel: string;
  yLabel: string;
}

// DummyDataStore
export interface DummyDataStoreModel extends ObjModel {
  data: DummyDataSupportedTypes;
}


// FunctionPlotString
export interface FunctionPlotStringModel extends TransformObjModel {
  id: number;
  color: string;
  functionStr: FunctionStrModel;
  xRange: [number, number];
  numPoints: number;
  lineWidth: number;
}

// GeomObj
export interface GeomObjModel extends TransformObjModel {
  geom_json: PredefinedGeometry;
  isClickable: boolean;
}

// LineObj
export interface LineObjModel extends ColoredObjModel {
  constructionType: "endpoints" | "slopeIntercept" | "twoPointsAndLength";
  start: { x: number; y: number };
  end: { x: number; y: number };
  slope: number;
  intercept: number;
  line_width: number;
  length?: number;
  point1: { x: number; y: number };
  point2: { x: number; y: number };
}

// TextGeom
export interface TextGeomModel extends GeomObjModel {
  text: string;
}

// QUESTION
export interface QuestionModel {
  id: number;
  text: string
}


// VALIDATIONS

export interface ValidationModel {
  // is_valid: boolean; we dont need this as the system will compute it when we load it back
  desc: string;
  type: Validation_types;
}


export type SerializableValueType = number | { x: number; y: number } | { x: number; y: number; z: number };

export interface ValidationObjModel extends ValidationModel {
  answer: SerializableValueType;
  obj_id: number;
  get_attribute_json: Attribute_get
  error: number;
  relation: relation;
}

export interface ValidationScoreModel extends ValidationModel {
  score_id: number;
  target_score: number;
  error: number;
  relation: relation;
}

export interface ValidationTableControlModel<T> extends ValidationModel {
  answers: number[][];
  control_id: number;
  error: number;
  validateCells: boolean[][];
}

export interface ValidationSelectModel extends ValidationModel {
  answer: number[];
  control_id: number;
}

export interface ValidationMultiChoiceModel extends ValidationModel {
  answer: number[];
  control_id: number;
}

export interface ValidationInputNumberModel extends ValidationModel {
  answer: number;
  control_id: number;
  error: number;
}

export interface ValidationSliderAdvModel extends ValidationModel {
  control_id: number;
  target_value: number;
  error: number;
  relation: relation;
}

// Base Control Model
export interface ControlModel {
  id: number;
  desc: string;
  text: string;
  // isClickable: boolean; do not need to store this in database
  type: string;
}

// SliderControl Model
export interface SliderControlAdvModel extends ControlModel {
  range: [number, number];
  value: number;
  step: number;
  attribute_pairs: AttributePairSet_json; // We'll store this as a string representation of the function
}

// SelectControl Model
export interface SelectControlModel extends ControlModel {
  selectable: number[]
  capacity: number
}

// TableControl Model
export interface TableControlModel extends ControlModel {
  rows: TableRow<obj>;
  columnHeaders: string[];
  rowHeaders: string[];
}


// MultiChoiceControl Model
export interface MultiChoiceControlModel extends ControlModel {
  options: Option[];
  isMultiSelect?: boolean;
}

// InputNumberControl Model
export interface InputNumberControlModel extends ControlModel {
  value: number;
  placeholder: string;
  initial_value: number;
  min: number;
  max: number;
  step: number;
  attribute_pairs?: AttributePairSet_json[];
  obj_id : number
}

// SCORE

export interface FunctionScoreModel {
  score_id: number
  functionStr: FunctionStrModel;
  text: string;
  desc: string;
}

// string representation of a function
export interface FunctionStrModel {
  id: number;
  functionString: string;
  symbols: AttributePairGet[];
}

// PLACEMENT

export interface PlacementModel {
  id: number;
  object_ids: number[];
  grid: [number, number];
  cellSize: number;
  geometry_json: PredefinedGeometry;
  gridVectors: { x: number; y: number };
  text: string;
  desc: string;
  color: string;
  max_placements: number;
  type: placement_type
}

// Union type for all Placement models
export type AllPlacementModels = PlacementModel


// Union type for all Score models
export type AllScoreObjectModels = FunctionScoreModel

// Union type for all control models
export type AllControlObjectModels =
  | ControlModel
  | SliderControlAdvModel
  | SelectControlModel
  | TableControlModel
  | MultiChoiceControlModel
  | InputNumberControlModel;

// Union type for all validation models
export type AllValidationObjectModels =
  | ValidationModel
  | ValidationObjModel
  | ValidationScoreModel
  | ValidationTableControlModel<any>
  | ValidationSelectModel
  | ValidationMultiChoiceModel
  | ValidationInputNumberModel;

// Union type for all vizobject models
export type AllVizObjectModels =
  | ObjModel
  | CoordinateAxisModel
  | DummyDataStoreModel
  | GeomObjModel
  | LineObjModel
  | TextGeomModel
  | FunctionPlotStringModel;


// Helper function to convert Vector2 to a plain object
export function vector2ToJson(vec: Vector2): { x: number; y: number } {
  return { x: vec.x, y: vec.y };
}

// Helper function to convert Vector3 to a plain object
export function vector3ToJson(vec: Vector3): {
  x: number;
  y: number;
  z: number;
} {
  return { x: vec.x, y: vec.y, z: vec.z };
}

export function jsonToVector2(json: { x: number; y: number }): Vector2 {
  return new Vector2(json.x, json.y);
}

export function jsonToVector3(json: { x: number; y: number; z: number }): Vector3 {
  return new Vector3(json.x, json.y, json.z);
}
