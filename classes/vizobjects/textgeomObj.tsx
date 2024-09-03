import { geomobj } from "./geomobj";
import * as THREE from "three";
import { TouchControl } from "../Controls/TouchControl";
import { ThreeEvent } from "react-three-fiber";
import { Text } from "@react-three/drei";

/*
 * This class is used to create a object that has Text on it in the scene.
*/
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
    text = "", // text on the object
    isEnabled = true,
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
      isEnabled: isEnabled,
    });
    this.text = text;
    this.name = text;
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
    objectRef: React.RefObject<any>;
    material: THREE.Material | null;
  }> & {
    children: React.ReactElement | null;
    objectRef: React.RefObject<THREE.Mesh>;
  }): React.ReactElement {
    return (
      <group
        ref={objectRef}
        position={[this.position.x, this.position.y, 0]}
        onPointerDown={this.isClickable ? onClickSelect : undefined}
        rotation={[this.rotation.x, this.rotation.y, this.rotation.z]}
        scale={[this.scale.x, this.scale.y, this.scale.z]}
      >
        <mesh>
          <primitive object={this.geom} attach="geometry" />
          {material ? (
            <primitive object={material} attach="material" />
          ) : (
            <meshBasicMaterial color={this.color} side={THREE.DoubleSide} />
          )}
        </mesh>

        <Text color="white" anchorX="center" anchorY="middle">
          {this.text}
        </Text>
      </group>
    );
  }
}
