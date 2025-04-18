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
import { AxisObjectInsert, AxisObjectSelect } from "@/app/db/schema";

/*
 * This class is used to create a Coordinate Axis (2D coordinate graph) in the scene.
 */

export type AxisConstTypes = "coordinate" | "numberLine";

interface CoordinateAxisConstructor extends TransformObjConstructor {
  constructionType?: AxisConstTypes;
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
  constructionType: AxisConstTypes;
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
    color = "#FFFFFF",
    touch_controls = new TouchControl(),
    constructionType = "coordinate",
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
    this.constructionType = constructionType;
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
    return { ...Axis_atts[type]};
  }

  serialize(): Omit<AxisObjectInsert, 'stateId'> {
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
      axisLength: this.axisLength,
      tickSpacing: this.tickSpacing,
      tickSize: this.tickSize,
      showLabels: this.showLabels,
      fontSize: this.fontSize,
      lineWidth: this.lineWidth,
      xLabel: this.xLabel,
      yLabel: this.yLabel,
      isNumberLine: this.constructionType === "numberLine"
    };
  }
  
  static deserialize(data: AxisObjectSelect): CoordinateAxis {
    return new CoordinateAxis({
      id: data.objId,
      name: data.name,
      position: new THREE.Vector2(data.position_x, data.position_y),
      rotation: new THREE.Vector3(data.rotation_x, data.rotation_y, data.rotation_z),
      scale: new THREE.Vector3(data.scale_x, data.scale_y, data.scale_z),
      color: data.color,
      touch_controls: data.touch_controls as TouchControl,
      constructionType: data.isNumberLine ? "numberLine" : "coordinate",
      axisLength: data.axisLength,
      tickSpacing: data.tickSpacing,
      tickSize: data.tickSize,
      showLabels: data.showLabels,
      fontSize: data.fontSize,
      lineWidth: data.lineWidth,
      xLabel: data.xLabel,
      yLabel: data.yLabel
    });
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

    const ticksX = [];
    const labelsX = [];

    // Add tick and label for origin (0)
    ticksX.push([
      new THREE.Vector3(0, -this.tickSize / 2, 0),
      new THREE.Vector3(0, this.tickSize / 2, 0),
    ]);

    // Only show origin label in number line mode
    if (this.showLabels && this.constructionType === "numberLine") {
      labelsX.push(
        <Text
          key="x-0"
          position={[0, -this.tickSize - this.fontSize / 2, 0]}
          fontSize={this.fontSize}
          color={material ? material.color : this.color}
          anchorX="center"
          anchorY="top"
        >
          {(0).toFixed(1)}
        </Text>
      );
    }

    // Start from the first tick after 0 and go right
    for (let i = this.tickSpacing; i <= this.axisLength / 2; i += this.tickSpacing) {
      // X-axis ticks
      ticksX.push([
        new THREE.Vector3(i, -this.tickSize / 2, 0),
        new THREE.Vector3(i, this.tickSize / 2, 0),
      ]);

      // Labels
      if (this.showLabels) {
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
      }
    }

    // Go left from the first tick before 0
    for (let i = -this.tickSpacing; i >= -this.axisLength / 2; i -= this.tickSpacing) {
      // X-axis ticks
      ticksX.push([
        new THREE.Vector3(i, -this.tickSize / 2, 0),
        new THREE.Vector3(i, this.tickSize / 2, 0),
      ]);

      // Labels
      if (this.showLabels) {
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
      }
    }

    if (this.constructionType === "coordinate") {
      // Only create y-axis elements if we're in coordinate mode
      const yAxisPoints = [
        new THREE.Vector3(0, -this.axisLength / 2, 0),
        new THREE.Vector3(0, this.axisLength / 2, 0),
      ];

      const ticksY = [];
      const labelsY = [];

      // Start from the middle (0) and go up
      for (let i = 0; i <= this.axisLength / 2; i += this.tickSpacing) {
        ticksY.push([
          new THREE.Vector3(-this.tickSize / 2, i, 0),
          new THREE.Vector3(this.tickSize / 2, i, 0),
        ]);

        if (this.showLabels && i !== 0) {
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

      // Go down from the middle (excluding 0)
      for (let i = -this.tickSpacing; i >= -this.axisLength / 2; i -= this.tickSpacing) {
        ticksY.push([
          new THREE.Vector3(-this.tickSize / 2, i, 0),
          new THREE.Vector3(this.tickSize / 2, i, 0),
        ]);

        if (this.showLabels) {
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

      return (
        <group
          ref={objectRef}
          position={[this.position.x, this.position.y, 0]}
          rotation={[this.rotation.x, this.rotation.y, this.rotation.z]}
          scale={[this.scale.x, this.scale.y, this.scale.z]}
          onPointerDown={this.isClickable ? onClickSelect : undefined}
        >
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
          {labelsX}
          {labelsY}
          {/* X-axis label */}
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
          {/* Y-axis label */}
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
          {children}
        </group>
      );
    } else {
      // Number line mode - only render x-axis elements
      return (
        <group
          ref={objectRef}
          position={[this.position.x, this.position.y, 0]}
          rotation={[this.rotation.x, this.rotation.y, this.rotation.z]}
          scale={[this.scale.x, this.scale.y, this.scale.z]}
          onPointerDown={this.isClickable ? onClickSelect : undefined}
        >
          <Line
            points={xAxisPoints}
            color={material ? material.color : this.color}
            lineWidth={this.lineWidth}
          />
          {ticksX.map((points, i) => (
            <Line
              key={`xtick-${i}`}
              points={points}
              color={material ? material.color : this.color}
              lineWidth={this.lineWidth}
            />
          ))}
          {labelsX}
          {/* X-axis label */}
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
          {children}
        </group>
      );
    }
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
    const [editedObject, setEditedObject] = React.useState<CoordinateAxisConstructor>({
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
      constructionType: "coordinate",
      position: new THREE.Vector2(0, 0),
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
        { key: "position", label: "Position", type: "position" },
        { key: "axisLength", label: "Axis Length", type: "number" },
        { key: "showLabels", label: "Show Labels", type: "checkbox" },
        {
          key: "constructionType",
          label: "Type",
          type: "select",
          options: [
            { label: "Coordinate System", value: "coordinate" },
            { label: "Number Line", value: "numberLine" },
          ],
        },
        {
          key: "xLabel",
          label: "X Label",
          type: "text",
        },
        {
          key: "yLabel",
          label: "Y Label",
          type: "text",
          showIf: (obj) => obj.constructionType === "coordinate",
        },
      ],
    };
    return <EditableObjectPopup {...popupProps} />;
  }
}
