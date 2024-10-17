

import { TransformObj, TransformObjConstructor } from "./transformObj";
import * as THREE from "three";
import { TouchControl } from "../Controls/TouchControl";
import { ThreeEvent } from "react-three-fiber";
import { Line } from "@react-three/drei";
import React from "react";
import { functionplot_atts,  get_attributes, dict_keys} from "./get_set_obj_attributes";


/*
 * object that represents a function, it is plotted using lots of lines attached together
 * to make the curve look smoother increase the num of points
*/

interface FunctionPlotConstructor extends TransformObjConstructor {
  func?: (x: number) => number;
  xRange?: [number, number];
  numPoints?: number;
  lineWidth?: number;
  isClickable?: boolean;
  OnClick?: (event: ThreeEvent<MouseEvent>) => void;
}

export default class FunctionPlot extends TransformObj {
  func: (x: number) => number;
  xRange: [number, number];
  numPoints: number;
  lineWidth: number;
  isClickable: boolean;
  OnClick?: (event: ThreeEvent<MouseEvent>) => void;

  constructor({
    name = "FunctionPlot",
    id,
    position = new THREE.Vector2(0, 0),
    rotation = new THREE.Vector3(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    color = "white",
    touch_controls = new TouchControl(),
    func = (x: number) => x,
    xRange = [-10, 10],
    numPoints = 100,
    lineWidth = 2,
    isClickable = false,
    OnClick,
    isEnabled = true,
  }: FunctionPlotConstructor) {
    super({
      id,
      position,
      rotation,
      scale,
      color,
      touch_controls,
      name: name,
      isEnabled,
    });
    this.func = func;
    this.xRange = xRange;
    this.numPoints = numPoints;
    this.lineWidth = lineWidth;
    this.isClickable = isClickable;
    this.OnClick = OnClick;
    this.type = 'FunctionPlot';
  }

  get_set_att_selector(type: dict_keys): {[key: string]: get_attributes<any, any>} {
    return {...super.get_set_att_selector(type), ...functionplot_atts[type]}
  }

  dataBaseSave(): FunctionPlotConstructor  {
    return {
      id: this.id,
      name: this.name,
      position: this.position,
      rotation: this.rotation,
      scale: this.scale,
      color: this.color,
      touch_controls: this.touch_controls,
      func: this.func,
      xRange: this.xRange,
      numPoints: this.numPoints,
      lineWidth: this.lineWidth,
      isClickable: this.isClickable,
      OnClick: this.OnClick,
      isEnabled: this.isEnabled,
      type: 'FunctionPlot'
    };
  }
  
  // method that returns the physical three.js mesh representation of the object
  // this is used to render the object in the vizexperience
  getMesh({
    children,
    onClickSelect = (event: ThreeEvent<MouseEvent>) => {},
    objectRef,
    material = null,
  }: Partial<{
    children: React.ReactElement | null;
    onClickSelect: (event: ThreeEvent<MouseEvent>) => void;
    objectRef: React.RefObject<THREE.Mesh>;
    material: THREE.MeshBasicMaterial | null;
  }> & {
    children: React.ReactElement | null;
    objectRef: React.RefObject<any>;
  }): React.ReactElement {
    const points: THREE.Vector3[] = [];
    const [xMin, xMax] = this.xRange;
    const step = (xMax - xMin) / (this.numPoints - 1);

    for (let i = 0; i < this.numPoints; i++) {
      const x = xMin + i * step;
      const y = this.func(x);
      points.push(new THREE.Vector3(x, y, 0));
    }

    return (
      <group
        ref={objectRef}
        position={[this.position.x, this.position.y, 0]}
        rotation={[this.rotation.x, this.rotation.y, this.rotation.z]}
        scale={[this.scale.x, this.scale.y, this.scale.z]}
        onPointerDown={this.isClickable ? onClickSelect : undefined}
      >
        <Line
          points={points}
          color={material ? material.color : this.color}
          lineWidth={this.lineWidth}
        />
        {children}
      </group>
    );
  }
}