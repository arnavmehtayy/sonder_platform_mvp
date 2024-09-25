import { Vector2, Vector3 } from "three";
import { TouchControlAttributes } from "../Controls/TouchControl";
import { DummyDataSupportedTypes } from "../vizobjects/DummyDataStore";
import * as THREE from "three";

// Base interface for all objects
interface BaseObjectModel {
  id: number;
  name: string;
  isEnabled: boolean;
  type: string;
}

// Obj
export interface ObjModel extends BaseObjectModel {
  isClickable: boolean;
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

// GeomObj
export interface GeomObjModel extends TransformObjModel {
  geom: string; // Serialized geometry type
  param_t: number;
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

// Union type for all models
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
export function vector3ToPlain(vec: Vector3): { x: number; y: number; z: number } {
  return { x: vec.x, y: vec.y, z: vec.z };
}

// Helper function to serialize a function
export function serializeFunction(func: Function): string {
  return func.toString();
}

// Helper function to serialize geometry
export function serializeGeometry(geom: THREE.BufferGeometry): string {
  return JSON.stringify({
    type: geom.type,
    // Add other relevant properties as needed
  });
}
