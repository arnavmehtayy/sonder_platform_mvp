import { RefObject, ReactElement, JSXElementConstructor, useRef } from "react";
import { obj } from "./obj";
import { Vector2 } from "three";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";

import coloredObj, { coloredObjConstructor } from "./coloredObj";
import {
  EditableObjectPopup,
  EditableObjectPopupProps,
} from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import { get_attributes } from "./obj";

/*
 * This class is used to render a Line object in the scene.
 * This stores the start and end points of the line, and the line width.
 * This class provides functionality to convert between slope_intercept form and end points form.
 */

interface LineObjConstructor extends coloredObjConstructor {
  start?: Vector2;
  end?: Vector2;
  line_width?: number;
}

export class LineObj extends coloredObj {
  static get_controllable_atts: get_attributes<any, any>[] = [
    ...coloredObj.get_controllable_atts,
    {
      label: "line_width",
      get_attribute: (obj: LineObj) => obj.line_width,
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.line_width = value;
        return newObj;
      },
    },
    {
      label: "start",
      get_attribute: (obj: LineObj) => obj.start,
      set_attribute: (obj: LineObj, value: Vector2) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.start = value;
        return newObj;
      },
    },
    {
      label: "end",
      get_attribute: (obj: LineObj) => obj.end,
      set_attribute: (obj: LineObj, value: Vector2) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.end = value;
        return newObj;
      },
    },
    {
      label: "slope",
      get_attribute: (obj: LineObj) => obj.get_slope_intercept()[1],
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        const [b, m, range] = obj.get_slope_intercept();
        newObj.start = new Vector2(range[0], m * range[0] + b);
        newObj.end = new Vector2(range[1], m * range[1] + b);
        return newObj;
      },
    },
    {
      label: "intercept",
      get_attribute: (obj: LineObj) => obj.get_slope_intercept()[0],
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        const [b, m, range] = obj.get_slope_intercept();
        newObj.start = new Vector2(range[0], m * range[0] + b);
        newObj.end = new Vector2(range[1], m * range[1] + b);
        return newObj;
      },
    },
  ];
  start: Vector2;
  end: Vector2;
  line_width: number = 2;

  constructor({
    id,
    start = new Vector2(1, 1),
    end = new Vector2(0, 0),
    line_width = 2,
    color = "white",
    name = "Line",
    isEnabled = true,
  }: Partial<LineObjConstructor> & { id: number }) {
    super({ id: id, name: name, color: color, isEnabled: isEnabled });
    this.start = start;
    this.end = end;
    this.line_width = line_width;
    this.color = color;
    this.isClickable = false;
  }

  // methods that instantiates a new LineObj object with the slope and intercept values.
  static set_slope_intercept(
    obj: LineObj,
    b: number,
    m: number,
    range: [number, number]
  ) {
    const start = new THREE.Vector2(range[0], m * range[0] + b);
    const end = new THREE.Vector2(range[1], m * range[1] + b);
    return new LineObj({ ...obj, start: start, end: end });
  }

  // instantiates a new LineObj object with the start and end points.
  static set_endpoints(obj: LineObj, start: Vector2, end: Vector2) {
    return new LineObj({ ...obj, start: start, end: end });
  }

  // returns the slope and intercept of the given line object
  get_slope_intercept(): [number, number, [number, number]] {
    if (this.end.x - this.start.x === 0) {
      return [this.start.y, 0, [this.start.x, this.end.x]];
    }
    const m = (this.end.y - this.start.y) / (this.end.x - this.start.x);
    const b = this.start.y - m * this.start.x;
    return [b, m, [this.start.x, this.end.x]];
  }

  get_length(): number {
    return this.start.distanceTo(this.end);
  }

  // method that returns the physical three.js mesh representation of the object
  // this is used to render the object in the vizexperience
  getMesh({
    children = null,
    onClickSelect,
    objectRef,
    material = null,
  }: Partial<{
    children: React.ReactElement | null;
    onClickSelect: (event: ThreeEvent<MouseEvent>) => void;
    objectRef: RefObject<THREE.Mesh>;
    material: THREE.MeshBasicMaterial | null;
  }> & {
    objectRef: RefObject<THREE.Mesh>;
  }): ReactElement<any, string | JSXElementConstructor<any>> {
    return (
      <mesh
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
        ref={objectRef}
        onPointerDown={this.isClickable ? onClickSelect : undefined}
      >
        <primitive
          object={
            new THREE.MeshStandardMaterial({
              color: this.color,
              side: THREE.DoubleSide,
            })
          }
          attach="material"
        />
        <Line
          points={[
            [this.start.x, this.start.y, 0],
            [this.end.x, this.end.y, 0],
          ]}
          color={material ? material.color : this.color}
          lineWidth={this.line_width}
          segments
          dashed={false}
          {...{ linebutt: "round", linecap: "round" }}
        ></Line>
        {children}
      </mesh>
    );
  }

  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newObject: obj) => void;
  }): React.ReactElement {
    const editedObject: LineObjConstructor = {
      id: 0,
      name: "Line",
      isEnabled: true,
      start: new Vector2(-100, -100),
      end: new Vector2(100, 100),
      line_width: 2,
      color: "white",
    };

    const popupProps: EditableObjectPopupProps<LineObjConstructor> = {
      isOpen,
      onClose,
      object: editedObject,
      onSave: (updatedObject: LineObjConstructor) => {
        const newObj = new LineObj(updatedObject);
        onSave(newObj);
      },
      title: `Create New Object`,
      fields: [
        { key: "id", label: "ID", type: "number" },
        { key: "name", label: "Name", type: "text" },
        { key: "isEnabled", label: "Enabled", type: "checkbox" },
        { key: "line_width", label: "Line Width", type: "number" },
        { key: "color", label: "Color", type: "color" },
      ],
    };
    return <EditableObjectPopup {...popupProps} />;
  }
}
