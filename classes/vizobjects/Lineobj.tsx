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
import { line_atts, get_attributes, dict_keys } from "./get_set_obj_attributes";
import React from "react";

/*
 * This class is used to render a Line object in the scene.
 * This stores the start and end points of the line, and the line width.
 * This class provides functionality to convert between slope_intercept form and end points form.
 */

export type LineConstTypes = "endpoints" | "slopeIntercept" | "twoPointsAndLength";

interface LineObjConstructor extends coloredObjConstructor {
  constructionType?: LineConstTypes;
  start?: Vector2;
  end?: Vector2;
  slope?: number;
  intercept?: number;
  line_width?: number;
  length?: number;
  point1?: Vector2;
  point2?: Vector2;
}

export class LineObj extends coloredObj {
  start: Vector2;
  end: Vector2;
  line_width: number = 2;
  constructionType: "endpoints" | "slopeIntercept" | "twoPointsAndLength";
  slope: number;
  intercept: number;
  length?: number;
  point1: Vector2;
  point2: Vector2;

  constructor({
    id,
    constructionType = "endpoints",
    start = new Vector2(0, 0),
    end = new Vector2(1, 1),
    slope = 0,
    intercept = 0,
    length = 10,
    line_width = 2,
    color = "white",
    name = "Line",
    isEnabled = true,
    point1 = new Vector2(0, 0),
    point2 = new Vector2(1, 1),
  }: LineObjConstructor) {
    super({ id, name, color, isEnabled });
    this.constructionType = constructionType;
    this.line_width = line_width;
    this.length = length;
    this.start = start;
    this.end = end;
    this.point1 = point1;
    this.point2 = point2;
    this.slope = slope;
    this.intercept = intercept;
    this.type = "LineObj";

    if (constructionType === "slopeIntercept") {
      this.updateEndpoints();
    } else if (constructionType === "twoPointsAndLength") {
      this.updateEndpointsFromTwoPoints();
    }
  }

  dataBaseSave(): LineObjConstructor  {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      isEnabled: this.isEnabled,
      constructionType: this.constructionType,
      start: this.start,
      end: this.end,
      slope: this.slope,
      intercept: this.intercept,
      line_width: this.line_width,
      length: this.length,
      point1: this.point1,
      point2: this.point2,
      type: "LineObj",
    };
  }

  public set_points(
    value: number,
    type: "point1-x" | "point1-y" | "point2-x" | "point2-y"
  ) {
    switch (type) {
      case "point1-x":
        this.point1 = new Vector2(value, this.point1.y);
        break;
      case "point1-y":
        this.point1 = new Vector2(this.point1.x, value);
        break;
      case "point2-x":
        this.point2 = new Vector2(value, this.point2.y);
        break;
      case "point2-y":
        this.point2 = new Vector2(this.point2.x, value);
        break;
    }
    this.updateEndpointsFromTwoPoints();
  }

  private updateEndpointsFromTwoPoints() {
    if (this.point1 && this.point2 && this.length) {
      const direction = new THREE.Vector2()
        .subVectors(this.point2, this.point1)
        .normalize();
      const halfLength = this.length / 2;
      const midpoint = new THREE.Vector2()
        .addVectors(this.point1, this.point2)
        .multiplyScalar(0.5);

      this.start = new THREE.Vector2().addVectors(
        midpoint,
        direction.clone().multiplyScalar(-halfLength)
      );
      this.end = new THREE.Vector2().addVectors(
        midpoint,
        direction.clone().multiplyScalar(halfLength)
      );
    }
  }

  private updateEndpoints() {
    if (
      this.constructionType === "slopeIntercept" &&
      this.slope !== undefined &&
      this.intercept !== undefined &&
      this.length !== undefined
    ) {
      const half_length = this.length / 2;
      const start = new THREE.Vector2(
        -half_length,
        this.slope * -half_length + this.intercept
      );
      const end = new THREE.Vector2(
        half_length,
        this.slope * half_length + this.intercept
      );
      this.start = start;
      this.end = end;
    }
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

  // write a function that given a type of output you want from your get_set_att_selector, it returns a list of attributes that can be controlled
  get_set_att_selector(type: dict_keys): {[key: string]: get_attributes<any, any>} {
    return {...super.get_set_att_selector(type), ...line_atts[type]};
  }
  // method that returns the physical three.js mesh representation of the object
  // this is used to render the object in the vizexperience
  getMesh({
    children,
    onClickSelect,
    objectRef,
    material,
  }: Partial<{
    children: React.ReactElement | null;
    onClickSelect: (event: ThreeEvent<MouseEvent>) => void;
    objectRef: React.RefObject<THREE.Mesh>;
    material: THREE.MeshStandardMaterial | null;
  }> & {
    children: React.ReactElement | null;
    objectRef: React.RefObject<THREE.Mesh>;
  }): React.ReactElement {
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
    const [editedObject, setEditedObject] = React.useState<LineObjConstructor>({
      id: Date.now() % 10000,
      name: "Line",
      isEnabled: true,
      constructionType: "endpoints",
      start: new Vector2(0, 0),
      end: new Vector2(1, 1),
      slope: 1,
      intercept: 0,
      line_width: 2,
      color: "white",
      length: 10,
      point1: new Vector2(0, 0),
      point2: new Vector2(1, 1),
    });

    const popupProps: EditableObjectPopupProps<LineObjConstructor> = {
      isOpen,
      onClose,
      object: editedObject,
      set_object: setEditedObject,
      onSave: (updatedObject: LineObjConstructor) => {
        const newObj = new LineObj(updatedObject);
        onSave(newObj);
      },
      title: `Create New Line`,
      fields: [
        { key: "name", label: "Name", type: "text" },
        { key: "line_width", label: "Line Width", type: "number" },
        {
          key: "constructionType",
          label: "Construction Type",
          type: "select",
          options: [
            { label: "Endpoints", value: "endpoints" },
            { label: "Slope-Intercept", value: "slopeIntercept" },
            { label: "Two Points and Length", value: "twoPointsAndLength" },
          ],
        },
        {
          key: "start",
          label: "Start Point",
          type: "position",
          showIf: (obj) => obj.constructionType === "endpoints",
        },
        {
          key: "end",
          label: "End Point",
          type: "position",
          showIf: (obj) => obj.constructionType === "endpoints",
        },
        {
          key: "slope",
          label: "Slope",
          type: "number",
          showIf: (obj) => obj.constructionType === "slopeIntercept",
        },
        {
          key: "intercept",
          label: "Intercept",
          type: "number",
          showIf: (obj) => obj.constructionType === "slopeIntercept",
        },
        {
          key: "point1",
          label: "Point 1",
          type: "position",
          showIf: (obj) => obj.constructionType === "twoPointsAndLength",
        },
        {
          key: "point2",
          label: "Point 2",
          type: "position",
          showIf: (obj) => obj.constructionType === "twoPointsAndLength",
        },
        {
          key: "length",
          label: "Length",
          type: "number",
          showIf: (obj) =>
            obj.constructionType === "slopeIntercept" ||
            obj.constructionType === "twoPointsAndLength",
        },
        { key: "color", label: "Color", type: "color" },
      ],
    };
    return <EditableObjectPopup {...popupProps} />;
  }
}
