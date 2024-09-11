import React, { useState } from 'react';
import { EditableObjectPopup, EditableObjectPopupProps } from '@/app/Components/EditMode/EditPopups/EditableObjectPopup'
import * as THREE from 'three';
import { geomobj } from "./geomobj";
import { TouchControl } from "../Controls/TouchControl";
import { ThreeEvent } from "react-three-fiber";
import { Line } from "@react-three/drei";
import * as math from 'mathjs';

export default class FunctionPlotString extends geomobj {
  func: (x: number) => number;
  xRange: [number, number];
  numPoints: number;
  lineWidth: number;
  functionString: string;

  constructor({
    id,
    position = new THREE.Vector2(0, 0),
    rotation = new THREE.Vector3(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    color = "white",
    geom = new THREE.PlaneGeometry(0.1, 0.1),
    touch_controls = new TouchControl(),
    param_t = 0,
    isClickable = false,
    OnClick = undefined,
    functionString = "x",
    xRange = [-10, 10],
    numPoints = 100,
    lineWidth = 2,
    isEnabled = true,
  }: Partial<FunctionPlotString> & { id: number }) {
    super({
      id: id,
      position: position,
      rotation: rotation,
      scale: scale,
      color: color,
      geom: geom,
      touch_controls: touch_controls,
      param_t: param_t,
      isClickable: isClickable,
      OnClick: OnClick,
      isEnabled: isEnabled,
    });
    this.functionString = functionString;
    this.func = this.parseFunction(functionString);
    this.xRange = xRange;
    this.numPoints = numPoints;
    this.lineWidth = lineWidth;
    this.name = "FunctionPlot";
  }

  parseFunction(functionString: string): (x: number) => number {
    const parsedFunction = math.parse(functionString);
    return (x: number) => {
      const scope = { x };
      return parsedFunction.evaluate(scope);
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
      <FunctionPlotPopup
        isOpen={isOpen}
        onClose={onClose}
        onSave={onSave}
      />
    );
  }
}

interface FunctionPlotConstructor {
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
}

const FunctionPlotPopup: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (obj: FunctionPlotString) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [error, setError] = useState<string | null>(null);

  const popupProps: EditableObjectPopupProps<FunctionPlotConstructor> = {
    isOpen,
    onClose,
    object: {
      id: Date.now(),
      functionString: 'x',
      xRange: [-10, 10],
      numPoints: 200,
      lineWidth: 2,
      isEnabled: true,
      color: '#000000',

    },
    onSave: (updatedObject: FunctionPlotConstructor) => {
      try {
        // Attempt to parse the function string
        const testFunc = math.parse(updatedObject.functionString || 'x');
        testFunc.evaluate({ x: 0 }); // Test with a sample value
        
        const newObj = new FunctionPlotString({
          ...updatedObject,
          position: new THREE.Vector2(updatedObject.position?.x || 0, updatedObject.position?.y || 0),
          rotation: new THREE.Vector3(updatedObject.rotation?.x || 0, updatedObject.rotation?.y || 0, updatedObject.rotation?.z || 0),
          scale: new THREE.Vector3(updatedObject.scale?.x || 1, updatedObject.scale?.y || 1, updatedObject.scale?.z || 1),
        });
        onSave(newObj);
        setError(null);
      } catch (err) {
        setError('Invalid function input. Please enter a valid mathematical expression.');
      }
    },
    title: 'Create New Function Plot',
    fields: [
      { key: 'functionString', label: 'Function (e.g., sin(x))', type: 'text' },
      { key: 'lineWidth', label: 'Line Width', type: 'number' },
      { key: 'color', label: 'Color', type: 'color' },
    { key: 'xRange', label: 'X Range', type: 'arraynum', length_of_array: 2 },

    ],
  };

  return (
    <>
      <EditableObjectPopup {...popupProps} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </>
  );
};