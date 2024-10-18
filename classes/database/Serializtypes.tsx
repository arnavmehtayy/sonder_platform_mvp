import { TouchControl } from "../Controls/TouchControl";
import { geom_type, geom_param_type, PredefinedGeometry } from "../vizobjects/geomobj";
import { LineConstTypes } from "../vizobjects/Lineobj";

export interface SerializedObj {
  id: number;
  name: string;
  isEnabled: boolean;
  type: string;
}

export interface SerializedColoredObj extends SerializedObj {
  color: string;
}

export interface SerializedTransformObj extends SerializedColoredObj {
  position_x: number;
  position_y: number;
  rotation_x: number;
  rotation_y: number;
  rotation_z: number;
  scale_x: number;
  scale_y: number;
  scale_z: number;
  touch_controls: TouchControl;
}

export interface SerializedGeomObj extends SerializedTransformObj {
  geometry_type: geom_type
  geometry_params: geom_param_type 
  // note the above two will be got by breaking up the PredefinedGeometry object
}

export interface SerializedTextGeom extends SerializedGeomObj {
  text: string;
}

export interface SerializedLineObj extends SerializedColoredObj {
  constructionType: LineConstTypes;
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
  slope: number;
  intercept: number;
  line_width: number;
  length?: number;
  point1_x: number;
  point1_y: number;
  point2_x: number;
  point2_y: number;
}

export interface SerializedFunctionPlot extends SerializedTransformObj {
  XRange_a: number;
  XRange_b: number;
  numPoints: number;
  lineWidth: number;
}

export interface SerializedFunctionPlotString extends SerializedFunctionPlot {
  functionStr: string;
}

export interface SerializedDummyDataStorage extends SerializedObj {
  data: number;
}