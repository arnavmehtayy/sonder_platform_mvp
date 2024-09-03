import { obj } from "./obj";
import React from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";


/*
 * This class is used to create a colored object in the scene.
*/

export default class coloredObj extends obj {
  color: string;

  constructor({
    id,
    name = "TransformObj",
    color = "white",
    isEnabled = true,
  }: Partial<coloredObj> & { id: number; isEnabled: boolean }) {
    super({ id: id, name: name, isEnabled: isEnabled });
    this.color = color;
  }

  // method that returns the physical three.js mesh representation of the object
  // this is used to render the object in the vizexperience
  getMesh({
    children,
    onClickSelect = (event: ThreeEvent<MouseEvent>) => {},
    objectRef,
  }: Partial<{
    children: React.ReactElement | null;
    onClickSelect: (event: ThreeEvent<MouseEvent>) => void;
    objectRef: React.RefObject<THREE.Mesh>;
  }> & {
    children: React.ReactElement;
    objectRef: React.RefObject<any>;
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
        {children}
      </mesh>
    );
  }
}
