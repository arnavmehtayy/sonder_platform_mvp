/*
    This is the base class for every object in the scene.
*/

import React from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";

export class obj {
  id: number;
  name: string;
  isClickable: boolean = false;

  constructor({ id, name }: { id: number; name: string }) {
    this.id = id;
    this.name = name;
  }

  static setObjectisClickable(obj: obj, isClickable: boolean): obj {
    const newObj = Object.assign(
      Object.create(Object.getPrototypeOf(obj)),
      obj
    );
    obj.isClickable = isClickable;
    return obj;
  }

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
        {children}
      </mesh>
    );
  }
}
