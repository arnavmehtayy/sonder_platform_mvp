import { geomobj } from "./geomobj";
import * as THREE from "three";
import { TouchControl } from "./TouchControl";
import { ThreeEvent } from "react-three-fiber";
import { Line } from "@react-three/drei";
import { Text } from "@react-three/drei";

export default class CoordinateAxis extends geomobj {
  axisLength: number;
  tickSpacing: number;
  tickSize: number;
  showLabels: boolean;
  fontSize: number;
  lineWidth: number;

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
    axisLength = 60,
    tickSpacing = 2,
    tickSize = 0.2,
    showLabels = true,
    fontSize = 0.6,
    lineWidth = 4,
  }: Partial<CoordinateAxis> & { id: number }) {
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
    });
    this.axisLength = axisLength;
    this.tickSpacing = tickSpacing;
    this.tickSize = tickSize;
    this.showLabels = showLabels;
    this.fontSize = fontSize;
    this.lineWidth = lineWidth;
    this.name = "CoordinateAxis";
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

    for (let i = -this.axisLength / 2; i <= this.axisLength / 2; i += this.tickSpacing) {
      // X-axis ticks
      ticksX.push(
        [new THREE.Vector3(i, -this.tickSize / 2, 0),
        new THREE.Vector3(i, this.tickSize / 2, 0)]
      );

      // Y-axis ticks
      ticksY.push(
        [new THREE.Vector3(-this.tickSize / 2, i, 0),
        new THREE.Vector3(this.tickSize / 2, i, 0)]
      );

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
            {i}
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
            {i}
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
      >
        {ticksX.map((points, i) => (
          <Line key={`xtick-${i}`} points={points} color={material ? material.color : this.color} lineWidth={this.lineWidth} />
        ))}
        {ticksY.map((points, i) => (
          <Line key={`ytick-${i}`} points={points} color={material ? material.color : this.color} lineWidth={this.lineWidth} />
        ))}
        <Line points={xAxisPoints} color={material ? material.color : this.color} lineWidth={this.lineWidth} />
        <Line points={yAxisPoints} color={material ? material.color : this.color} lineWidth={this.lineWidth} />
        {/* <Line points={ticksX} color={this.color} lineWidth={this.lineWidth} />
        <Line points={ticksY} color={this.color} lineWidth={this.lineWidth} /> */}
        {labelsX}
        {labelsY}
        {children}
      </group>
    );
  }
}