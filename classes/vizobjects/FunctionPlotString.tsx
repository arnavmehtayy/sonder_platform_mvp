import React, { useState } from "react";
import {
  EditableObjectPopup,
  EditableObjectPopupProps,
} from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import * as THREE from "three";
import { geomobj, geomobjconstructor } from "./geomobj";
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

export default class FunctionPlotString extends TransformObj {
  func: (x: number, t: number) => number;
  xRange: [number, number];
  numPoints: number;
  lineWidth: number;
  functionString: string;
  tValue: number;
  isParametric: boolean;

  constructor({
    name = "FunctionPlot",
    id,
    position = new THREE.Vector2(0, 0),
    rotation = new THREE.Vector3(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    color = "white",
    touch_controls = new TouchControl(),
    functionString = "x",
    xRange = [-10, 10],
    numPoints = 100,
    lineWidth = 2,
    isEnabled = true,
    tValue = 0,
    isParametric = false,
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
    this.functionString = functionString;
    this.func = this.parseFunction(functionString);
    this.xRange = xRange;
    this.numPoints = numPoints;
    this.lineWidth = lineWidth;
    this.name = name;
    this.tValue = tValue;
    this.isParametric = isParametric;
    this.type = "FunctionPlotString";
  }

  get_set_att_selector(type: dict_keys): {[key: string]: get_attributes<any, any>} {
    return {
      ...super.get_set_att_selector(type),
      ...FunctionPlotString_atts[type],
    };
  }

  parseFunction(functionString: string): (x: number, t: number) => number {
    const parsedFunction = math.parse(functionString);
    return (x: number, t: number) => {
      const scope = { x, t };
      return parsedFunction.evaluate(scope);
    };
  }

  dataBaseSave(): FunctionPlotStringConstructor & { type: string } {
    return {
      ...super.dataBaseSave(),
      functionString: this.functionString,
      xRange: this.xRange,
      numPoints: this.numPoints,
      lineWidth: this.lineWidth,
      tValue: this.tValue,
      isParametric: this.isParametric,
      type: "FunctionPlotString",
    };
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
      const y = this.func(x, this.tValue);
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
  functionString?: string;
  xRange?: [number, number];
  numPoints?: number;
  lineWidth?: number;
  isEnabled?: boolean;
  tValue?: number;
  isParametric?: boolean;
}

const FunctionPlotPopup: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (obj: FunctionPlotString) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [error, setError] = useState<string | null>(null);

  const [editedObject, setEditedObject] =
    useState<FunctionPlotStringConstructor>({
      id: Date.now() % 10000,
      functionString: "x",
      xRange: [-10, 10],
      numPoints: 200,
      lineWidth: 2,
      isEnabled: true,
      color: "#000000",
      tValue: 0,
      isParametric: false,
      name: "FunctionPlot",
    });

  const popupProps: EditableObjectPopupProps<FunctionPlotStringConstructor> = {
    isOpen,
    onClose,
    object: editedObject,
    set_object: setEditedObject,
    onSave: (updatedObject: FunctionPlotStringConstructor) => {
      try {
        // Attempt to parse the function string
        const testFunc = math.parse(updatedObject.functionString || "x");
        testFunc.evaluate({ x: 0, t: 0 }); // Test with sample values

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
        key: "functionString",
        label: "Function (e.g., sin(x) + t)",
        type: "text",
      },
      { key: "lineWidth", label: "Line Width", type: "number" },
      { key: "color", label: "Color", type: "color" },
      { key: "xRange", label: "X Range", type: "arraynum", length_of_array: 2 },
      { key: "tValue", label: "T Value", type: "number" },
      { key: "isParametric", label: "Is Parametric", type: "checkbox" },
    ],
  };

  return (
    <>
      <EditableObjectPopup {...popupProps} />
      {error && <div style={{ color: "red" }}>{error}</div>}
    </>
  );
};
