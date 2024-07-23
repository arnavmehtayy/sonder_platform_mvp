import { geomobj } from "./geomobj";
import * as THREE from "three";
import { TouchControl } from "./TouchControl";
import { ThreeEvent } from "react-three-fiber";
import { Text } from "@react-three/drei";

export default class TextGeom extends geomobj {
  text: string;

  constructor({
    id,
    position = new THREE.Vector2(0, 0),
    rotation = new THREE.Vector3(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    color = "blue",
    geom, // geom remains a required parameter
    touch_controls = new TouchControl(),
    param_t = 0, // the parametric parameter if the object is following a parametric object
    isClickable = true, // if this is false then this object cannot detect a click at all
    OnClick = undefined,
    text = "",
  }: Partial<TextGeom> & { geom: THREE.BufferGeometry; id: number }) {
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
    this.text = text;
    this.name = text;
  }

  getMesh({
    children,
    onClickSelect = (event: ThreeEvent<MouseEvent>) => {},
    objectRef,
  }: Partial<{
    children: React.ReactElement | null;
    onClickSelect: (event: ThreeEvent<MouseEvent>) => void;
    objectRef: React.RefObject<any>;
  }> & {
    children: React.ReactElement | null;
    objectRef: React.RefObject<THREE.Mesh>;
  }): React.ReactElement {
    return (
      <group
        ref={objectRef}
        position={[this.position.x, this.position.y, 0]}
        onClick={this.isClickable ? onClickSelect : undefined}
        rotation={[this.rotation.x, this.rotation.y, this.rotation.z]}
        scale={[this.scale.x, this.scale.y, this.scale.z]}
      >
        <mesh>
          <primitive object={this.geom} attach="geometry" />
          <meshBasicMaterial color={this.color} side={THREE.DoubleSide} />
        </mesh>

        <Text color="white" anchorX="center" anchorY="middle">
          {this.text}
        </Text>
      </group>
    );
  }
}
