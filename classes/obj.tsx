/*
    This is the base class for every object in the scene.
*/

import React from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { is } from "@react-three/fiber/dist/declarations/src/core/utils";

export class obj {
  id: number;
  name: string;
  isClickable: boolean = false;
  isEnabled: boolean;

  constructor({
    id,
    name,
    isEnabled = true,
  }: {
    id: number;
    name: string;
    isEnabled: boolean;
  }) {
    this.id = id;
    this.name = name;
    this.isEnabled = isEnabled;
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
        {children}
      </mesh>
    );
  }
}
