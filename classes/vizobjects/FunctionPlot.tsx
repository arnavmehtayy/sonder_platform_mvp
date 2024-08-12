import { geomobj } from "./geomobj";
import * as THREE from "three";
import { TouchControl } from "../Controls/TouchControl";
import { ThreeEvent } from "react-three-fiber";
import { Line } from "@react-three/drei";

export default class FunctionPlot extends geomobj {
  func: (x: number) => number;
  xRange: [number, number];
  numPoints: number;
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
    func = (x: number) => x, // Default to y = x
    xRange = [-10, 10],
    numPoints = 100,
    lineWidth = 2,
    isEnabled = true,
  }: Partial<FunctionPlot> & { id: number }) {
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
    this.func = func;
    this.xRange = xRange;
    this.numPoints = numPoints;
    this.lineWidth = lineWidth;
    this.name = "FunctionPlot";
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
