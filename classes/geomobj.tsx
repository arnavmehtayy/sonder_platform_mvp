import { TransformObj } from "./transformObj";
import * as THREE from "three";
import { TouchControl } from "./TouchControl";
import { ThreeEvent } from "react-three-fiber";

/*
    * This class creates a geometric object on the scene (Any object that is rendered using THREE.BufferGeometry).
*/

export class geomobj extends TransformObj {
  color: string;
  geom: THREE.BufferGeometry;
  isClickable: boolean = false;
  OnClick: ((obj: geomobj) => void) | undefined;
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
  }: Partial<geomobj> & { geom: THREE.BufferGeometry; id: number }) {
    super({
      position: position,
      rotation: rotation,
      scale: scale,
      touch_controls: touch_controls,
      param_t: param_t,
      id: id,
    });
    this.geom = geom;
    this.color = color;
    this.isClickable = isClickable;
    this.OnClick = OnClick;
  }

    getMesh({
        children,
        onClickSelect = (event:  ThreeEvent<MouseEvent>) => {},
        objectRef,
    }: Partial<{
        children: React.ReactElement | null;
        onClickSelect: (event:  ThreeEvent<MouseEvent>) => void;
        objectRef: React.RefObject<THREE.Mesh>;
    }> & {
        children: React.ReactElement | null;
        objectRef: React.RefObject<THREE.Mesh>;
    }): React.ReactElement {
        return (
            <mesh
            position={[this.position.x, this.position.y, 0]}
            rotation={[this.rotation.x, this.rotation.y, this.rotation.z]}
            scale={[this.scale.x, this.scale.y, this.scale.z]}
            ref={objectRef}
            onClick={this.isClickable ? onClickSelect : undefined}
          >
            <primitive object={this.geom} attach="geometry" />
            <meshBasicMaterial color={this.color} side={THREE.DoubleSide} />
          </mesh>
        );
    }
}
