import { Vector2, Vector3 } from "three";
import { TouchControlAttributes } from "../Controls/TouchControl";
import { DummyDataSupportedTypes } from "../vizobjects/DummyDataStore";
import * as THREE from "three";
import { PredefinedGeometry } from "../vizobjects/geomobj";
import { value_typ, relation, Attribute_get } from "../Validation/Validation_obj";

// Obj
export interface ObjModel {
  isClickable: boolean;
  id: number;
  name: string;
  isEnabled: boolean;
  type: string; 
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

// FunctionPlot
export interface FunctionPlotModel extends TransformObjModel {
  func: string; // Serialized function
  xRange: [number, number];
  numPoints: number;
  lineWidth: number;
}

// FunctionPlotString
export interface FunctionPlotStringModel extends TransformObjModel {
  functionString: string;
  xRange: [number, number];
  numPoints: number;
  lineWidth: number;
  tValue: number;
  isParametric: boolean;
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

// VALIDATIONS

export interface ValidationModel {
  is_valid: boolean;
  desc: string;
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
  isClickable: boolean;
  type: string;
}

// SliderControl Model
export interface SliderControlModel extends ControlModel {
  range: [number, number];
  value: number;
  step: number;
  onChange: string; // We'll store this as a string representation of the function
}

// SelectControl Model
export interface SelectControlModel extends ControlModel {
  options: { value: number; label: string }[];
  selected: number[];
}

// TableControl Model
export interface TableControlModel extends ControlModel {
  rows: {
    cells: {
      value: number;
      isEditable: boolean;
    }[];
  }[];
}

// ButtonControl Model
export interface ButtonControlModel extends ControlModel {
  onClick: string; // We'll store this as a string representation of the function
}

// MultiChoiceControl Model
export interface MultiChoiceControlModel extends ControlModel {
  choices: string[];
  selected: number[];
}

// InputNumberControl Model
export interface InputNumberControlModel extends ControlModel {
  value: number;
  min?: number;
  max?: number;
  step?: number;
}



// Union type for all control models
export type ControlObjectModel =
  | ControlModel
  | SliderControlModel
  | SelectControlModel
  | TableControlModel
  | ButtonControlModel
  | MultiChoiceControlModel
  | InputNumberControlModel;

// Union type for all validation models
export type ValidationObjectModel =
  | ValidationModel
  | ValidationObjModel
  | ValidationScoreModel
  | ValidationTableControlModel<any>
  | ValidationSelectModel
  | ValidationMultiChoiceModel
  | ValidationInputNumberModel;

// Union type for all vizobject models
export type VizObjectModel =
  | ObjModel
  | ColoredObjModel
  | TransformObjModel
  | CoordinateAxisModel
  | DummyDataStoreModel
  | FunctionPlotModel
  | GeomObjModel
  | LineObjModel
  | TextGeomModel;


// Helper function to convert Vector2 to a plain object
export function vector2ToPlain(vec: Vector2): { x: number; y: number } {
  return { x: vec.x, y: vec.y };
}

// Helper function to convert Vector3 to a plain object
export function vector3ToPlain(vec: Vector3): {
  x: number;
  y: number;
  z: number;
} {
  return { x: vec.x, y: vec.y, z: vec.z };
}
