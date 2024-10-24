import React, { useState } from "react";
import {
  EditableObjectPopup,
  EditableObjectPopupProps,
} from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import * as THREE from "three";
import { TouchControl } from "../Controls/TouchControl";
import { ThreeEvent } from "react-three-fiber";
import { Line } from "@react-three/drei";
import * as math from "mathjs";
import {
  get_attributes,
  dict_keys,
  FunctionPlotString_atts,
} from "./get_set_obj_attributes";
import { TransformObj, TransformObjConstructor } from "./transformObj";
import { FunctionStr, FunctionStrEditor, FunctionStrConstructor } from '../Controls/FunctionStr';
import { useStore } from '@/app/store';
import { FunctionPlotStringInsert, FunctionPlotStringSelect } from "@/app/db/schema";

export default class FunctionPlotString extends TransformObj {
  func: (x: number) => number;
  xRange: [number, number];
  numPoints: number;
  lineWidth: number;
  functionStr: FunctionStr;

  constructor({
    name = "FunctionPlot",
    id,
    position = new THREE.Vector2(0, 0),
    rotation = new THREE.Vector3(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    color = "white",
    touch_controls = new TouchControl(),
    functionStr,
    xRange = [-10, 10],
    numPoints = 100,
    lineWidth = 2,
    isEnabled = true,
  }: FunctionPlotStringConstructor) {
    super({
      name: name,
      id: id,
      position: position,
      rotation: rotation,
      scale: scale,
      color: color,
      touch_controls: touch_controls,
      isEnabled: isEnabled,
    });
    this.functionStr = functionStr;
    this.func = this.parseFunction(functionStr);
    this.xRange = xRange;
    this.numPoints = numPoints;
    this.lineWidth = lineWidth;
    this.name = name;
    this.type = "FunctionPlotString";
  }

  get_set_att_selector(type: dict_keys): {[key: string]: get_attributes<any, any>} {
    return {
      ...FunctionPlotString_atts[type],
    };
  }

  parseFunction(functionStr: FunctionStr): (x: number) => number {
    const func = functionStr.get_function();
    const getState = useStore.getState;
    return (x: number) => {
      return func(x, getState);
    };
  }

  serialize(): Omit<FunctionPlotStringInsert, 'stateId'> {
    return {
      objId: this.id,
      name: this.name,
      color: this.color,
      position_x: this.position.x,
      position_y: this.position.y,
      rotation_x: this.rotation.x,
      rotation_y: this.rotation.y,
      rotation_z: this.rotation.z,
      scale_x: this.scale.x,
      scale_y: this.scale.y,
      scale_z: this.scale.z,
      touch_controls: this.touch_controls,
      functionStr: this.functionStr.functionString,
      symbols: this.functionStr.symbols,
      XRange_a: this.xRange[0],
      XRange_b: this.xRange[1],
      numPoints: this.numPoints,
      lineWidth: this.lineWidth
    };
  }
  
  static deserialize(data: FunctionPlotStringSelect): FunctionPlotString {
    return new FunctionPlotString({
      id: data.objId,
      name: data.name,
      position: new THREE.Vector2(data.position_x, data.position_y),
      rotation: new THREE.Vector3(data.rotation_x, data.rotation_y, data.rotation_z),
      scale: new THREE.Vector3(data.scale_x, data.scale_y, data.scale_z),
      color: data.color,
      touch_controls: data.touch_controls as TouchControl,
      functionStr: new FunctionStr(data.functionStr, data.symbols),
      xRange: [data.XRange_a, data.XRange_b],
      numPoints: data.numPoints,
      lineWidth: data.lineWidth
    });
  }

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

  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (obj: FunctionPlotString) => void;
  }) {
    return (
      <FunctionPlotPopup isOpen={isOpen} onClose={onClose} onSave={onSave} />
    );
  }
}

interface FunctionPlotStringConstructor extends TransformObjConstructor {
  id: number;
  position?: THREE.Vector2;
  rotation?: THREE.Vector3;
  scale?: THREE.Vector3;
  color?: string;
  functionStr: FunctionStr;
  xRange?: [number, number];
  numPoints?: number;
  lineWidth?: number;
  isEnabled?: boolean;
}

const FunctionPlotPopup: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (obj: FunctionPlotString) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [error, setError] = useState<string | null>(null);

  const [editedObject, setEditedObject] = useState<FunctionPlotStringConstructor>({
    id: Date.now() % 10000,
    functionStr: new FunctionStr("x", []),
    xRange: [-10, 10],
    numPoints: 500,
    lineWidth: 2,
    isEnabled: true,
    color: "#000000",
    name: "FunctionPlot",
  });

  const popupProps: EditableObjectPopupProps<FunctionPlotStringConstructor> = {
    isOpen,
    onClose,
    object: editedObject,
    set_object: setEditedObject,
    onSave: (updatedObject: FunctionPlotStringConstructor) => {
      try {
        const newObj = new FunctionPlotString({
          ...updatedObject,
          position: new THREE.Vector2(
            updatedObject.position?.x || 0,
            updatedObject.position?.y || 0
          ),
          rotation: new THREE.Vector3(
            updatedObject.rotation?.x || 0,
            updatedObject.rotation?.y || 0,
            updatedObject.rotation?.z || 0
          ),
          scale: new THREE.Vector3(
            updatedObject.scale?.x || 1,
            updatedObject.scale?.y || 1,
            updatedObject.scale?.z || 1
          ),
        });
        onSave(newObj);
        setError(null);
      } catch (err) {
        setError(
          "Invalid function input. Please enter a valid mathematical expression."
        );
      }
    },
    title: "Create New Function Plot",
    fields: [
      {
        key: "functionStr",
        label: "Function",
        type: "custom",
        render: (value: FunctionStr, onChange: (value: FunctionStr) => void) => (
          <FunctionStrEditor value={value} onChange={onChange} />
        ),
      },
      { key: "lineWidth", label: "Line Width", type: "number" },
      { key: "color", label: "Color", type: "color" },
      { key: "xRange", label: "X Range", type: "arraynum", length_of_array: 2 },
    ],
  };

  return (
    <>
      <EditableObjectPopup {...popupProps} />
      {error && <div style={{ color: "red" }}>{error}</div>}
    </>
  );
};