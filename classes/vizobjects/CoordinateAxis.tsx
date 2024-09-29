import { geomobj } from "./geomobj";
import * as THREE from "three";
import { TouchControl } from "../Controls/TouchControl";
import { ThreeEvent } from "react-three-fiber";
import { Line } from "@react-three/drei";
import { Text } from "@react-three/drei";
import { TransformObj, TransformObjConstructor } from "./transformObj";
import {
  EditableObjectPopup,
  EditableObjectPopupProps,
} from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import React from "react";
import { Axis_atts, get_attributes, dict_keys } from "./get_set_obj_attributes";

/*
 * This class is used to create a Coordinate Axis (2D coordinate graph) in the scene.
 */

interface CoordinateAxisConstructor extends TransformObjConstructor {
  axisLength?: number;
  tickSpacing?: number;
  tickSize?: number;
  showLabels?: boolean;
  fontSize?: number;
  lineWidth?: number;
  xLabel?: string;
  yLabel?: string;
  isClickable?: boolean;
}

export default class CoordinateAxis extends TransformObj {
  axisLength: number;
  tickSpacing: number;
  tickSize: number;
  showLabels: boolean;
  fontSize: number;
  lineWidth: number;
  xLabel: string;
  yLabel: string;
  isClickable: boolean;
  OnClick?: (event: ThreeEvent<MouseEvent>) => void;

  constructor({
    id,
    name = "CoordinateAxis",
    position = new THREE.Vector2(0, 0),
    rotation = new THREE.Vector3(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    color = "white",
    touch_controls = new TouchControl(),
    axisLength = 60,
    tickSpacing = 2,
    tickSize = 0.2,
    showLabels = true,
    fontSize = 0.6,
    lineWidth = 4,
    xLabel = "weight",
    yLabel = "height",
    isClickable = false,
    isEnabled = true,
  }: CoordinateAxisConstructor) {
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
    this.axisLength = axisLength;
    this.tickSpacing = tickSpacing;
    this.tickSize = tickSize;
    this.showLabels = showLabels;
    this.fontSize = fontSize;
    this.lineWidth = lineWidth;
    this.xLabel = xLabel;
    this.yLabel = yLabel;
    this.isClickable = isClickable;
    this.type = "CoordinateAxis";
  }

  get_set_att_selector(type: dict_keys): {[key: string]: get_attributes<any, any>} {
    return {...super.get_set_att_selector(type), ...Axis_atts[type]};
  }

  dataBaseSave(): CoordinateAxisConstructor & { type: string } {
    return {
      id: this.id,
      name: this.name,
      position: this.position,
      rotation: this.rotation,
      scale: this.scale,
      color: this.color,
      touch_controls: this.touch_controls,
      axisLength: this.axisLength,
      tickSpacing: this.tickSpacing,
      tickSize: this.tickSize,
      showLabels: this.showLabels,
      fontSize: this.fontSize,
      lineWidth: this.lineWidth,
      xLabel: this.xLabel,
      yLabel: this.yLabel,
      isClickable: this.isClickable,
      isEnabled: this.isEnabled,
      type: "CoordinateAxis",
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
    const xAxisPoints = [
      new THREE.Vector3(-this.axisLength / 2, 0, 0),
      new THREE.Vector3(this.axisLength / 2, 0, 0),
    ];
    const yAxisPoints = [
      new THREE.Vector3(0, -this.axisLength / 2, 0),
      new THREE.Vector3(0, this.axisLength / 2, 0),
    ];

    const ticksX = [];
    const ticksY = [];
    const labelsX = [];
    const labelsY = [];

    for (
      let i = -this.axisLength / 2;
      i <= this.axisLength / 2;
      i += this.tickSpacing
    ) {
      // X-axis ticks
      ticksX.push([
        new THREE.Vector3(i, -this.tickSize / 2, 0),
        new THREE.Vector3(i, this.tickSize / 2, 0),
      ]);

      // Y-axis ticks
      ticksY.push([
        new THREE.Vector3(-this.tickSize / 2, i, 0),
        new THREE.Vector3(this.tickSize / 2, i, 0),
      ]);

      // Labels
      if (this.showLabels && i !== 0) {
        labelsX.push(
          <Text
            key={`x-${i}`}
            position={[i, -this.tickSize - this.fontSize / 2, 0]}
            fontSize={this.fontSize}
            color={material ? material.color : this.color}
            anchorX="center"
            anchorY="top"
          >
            {i.toFixed(1)}
          </Text>
        );
        labelsY.push(
          <Text
            key={`y-${i}`}
            position={[-this.tickSize - this.fontSize / 2, i, 0]}
            fontSize={this.fontSize}
            color={material ? material.color : this.color}
            anchorX="right"
            anchorY="middle"
          >
            {i.toFixed(1)}
          </Text>
        );
      }
    }

    // Add axis labels
    const xAxisLabel = (
      <Text
        position={[
          this.axisLength / 4 + 2 * this.fontSize,
          -this.tickSize - 2 * this.fontSize,
          0,
        ]}
        fontSize={this.fontSize * 2}
        color={material ? material.color : this.color}
        anchorX="left"
        anchorY="top"
      >
        {this.xLabel}
      </Text>
    );

    const yAxisLabel = (
      <Text
        position={[
          -this.tickSize - 3 * this.fontSize,
          this.axisLength / 4 + 2 * this.fontSize,
          0,
        ]}
        fontSize={this.fontSize * 2}
        color={material ? material.color : this.color}
        anchorX="right"
        anchorY="bottom"
        rotation={[0, 0, Math.PI / 2]}
      >
        {this.yLabel}
      </Text>
    );

    return (
      <group
        ref={objectRef}
        position={[this.position.x, this.position.y, 0]}
        rotation={[this.rotation.x, this.rotation.y, this.rotation.z]}
        scale={[this.scale.x, this.scale.y, this.scale.z]}
        onPointerDown={this.isClickable ? onClickSelect : undefined}
      >
        {ticksX.map((points, i) => (
          <Line
            key={`xtick-${i}`}
            points={points}
            color={material ? material.color : this.color}
            lineWidth={this.lineWidth}
          />
        ))}
        {ticksY.map((points, i) => (
          <Line
            key={`ytick-${i}`}
            points={points}
            color={material ? material.color : this.color}
            lineWidth={this.lineWidth}
          />
        ))}
        <Line
          points={xAxisPoints}
          color={material ? material.color : this.color}
          lineWidth={this.lineWidth}
        />
        <Line
          points={yAxisPoints}
          color={material ? material.color : this.color}
          lineWidth={this.lineWidth}
        />
        {labelsX}
        {labelsY}
        {xAxisLabel}
        {yAxisLabel}
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
    onSave: (obj: CoordinateAxis) => void;
  }) {
    const [editedObject, setEditedObject] =
      React.useState<CoordinateAxisConstructor>({
        id: Date.now() % 10000,
        name: "CoordinateAxis",
        isEnabled: true,
        color: "#000000",
        touch_controls: new TouchControl(),
        axisLength: 60,
        isClickable: false,
        tickSpacing: 2,
        tickSize: 0.2,
        showLabels: true,
        fontSize: 0.6,
        lineWidth: 4,
        xLabel: "",
        yLabel: "",
      });

    const popupProps: EditableObjectPopupProps<CoordinateAxisConstructor> = {
      isOpen,
      onClose,
      object: editedObject,
      set_object: setEditedObject,
      onSave: (updatedObject: CoordinateAxisConstructor) => {
        const newObj = new CoordinateAxis(updatedObject);
        onSave(newObj);
      },
      title: `Create New Object`,
      fields: [
        { key: "name", label: "Name", type: "text" },
        { key: "color", label: "Color", type: "color" },
        { key: "axisLength", label: "Axis Length", type: "number" },
        { key: "showLabels", label: "Show Labels", type: "checkbox" },
        { key: "xLabel", label: "X Label", type: "text" },
        { key: "yLabel", label: "Y Label", type: "text" },
      ],
    };
    return <EditableObjectPopup {...popupProps} />;
  }
}
