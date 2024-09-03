

import React from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";

/*
    This is the base class for every object in the scene.
    This class is used to store the information about a object in the threejs scene
    The attributes of this class are: id, name, isClickable, isEnabled
*/


export class obj {
  id: number;
  name: string;
  isClickable: boolean = false; // whether the object on the screen can be clicked or not
  isEnabled: boolean; // whether the object can be visible or not

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

  // method to set the visibility of the object
  // this is used by the storage system
  static setEnableObject(obj: obj, isEnabled: boolean): obj {
    const newObj = Object.assign(
      Object.create(Object.getPrototypeOf(obj)),
      obj
    );
    newObj.isEnabled = isEnabled;
    return newObj
  }

  // method to set the ability for the object to be clicked 
  // this is used by the storage system
  static setObjectisClickable(obj: obj, isClickable: boolean): obj {
    const newObj = Object.assign(
      Object.create(Object.getPrototypeOf(obj)),
      obj
    );
    obj.isClickable = isClickable;
    return obj;
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
        {children}
      </mesh>
    );
  }
}
