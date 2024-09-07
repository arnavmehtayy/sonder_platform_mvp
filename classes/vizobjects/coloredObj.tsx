import { get_attributes, obj } from "./obj";
import React from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import { objconstructor } from "./obj";
import { EditableObjectPopup, EditableObjectPopupProps } from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";

/*
 * This class is used to create a colored object in the scene.
*/

export interface coloredObjConstructor extends objconstructor {
  color?: string;
}

export default abstract class coloredObj extends obj {
  static get_controllable_atts: get_attributes<any, any>[] = [
    ...obj.get_controllable_atts,
    { label: "color", get_attribute: (obj: coloredObj) => obj.color,
      set_attribute: (obj: coloredObj, value: string) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.color = value;
        return newObj;
      }
    },
  ];

  color: string;

  constructor({
    id,
    name = "TransformObj",
    color = "white",
    isEnabled = true,
  }: Partial<coloredObjConstructor> & { id: number; isEnabled: boolean }) {
    super({ id: id, name: name, isEnabled: isEnabled });
    this.color = color;
  }

  // method that returns the physical three.js mesh representation of the object
  // this is used to render the object in the vizexperience
  // getMesh({
  //   children,
  //   onClickSelect = (event: ThreeEvent<MouseEvent>) => {},
  //   objectRef,
  //   material = null,
  // }: Partial<{
  //   children: React.ReactElement | null;
  //   onClickSelect: (event: ThreeEvent<MouseEvent>) => void;
  //   objectRef: React.RefObject<THREE.Mesh>;
  //   material: THREE.MeshBasicMaterial | null;
  // }> & {
  //   children: React.ReactElement;
  //   objectRef: React.RefObject<any>;

  // }): React.ReactElement {
  //   return (
  //     <mesh
  //       position={[0, 0, 0]}
  //       rotation={[0, 0, 0]}
  //       scale={[1, 1, 1]}
  //       ref={objectRef}
  //       onPointerDown={this.isClickable ? onClickSelect : undefined}
  //     >
  //       <primitive
  //         object={
  //           new THREE.MeshStandardMaterial({
  //             color: this.color,
  //             side: THREE.DoubleSide,
  //           })
  //         }
  //         attach="material"
  //       />
  //       {children}
  //     </mesh>
  //   );
  // }

  abstract getMesh({
    children,
    onClickSelect,
    objectRef,
    material,
  }: Partial<{
    children: React.ReactElement | null;
    onClickSelect: (event: ThreeEvent<MouseEvent>) => void;
    objectRef: React.RefObject<THREE.Mesh>;
    material: THREE.Material | null;
  }> & {
    children: React.ReactElement | null;
    objectRef: React.RefObject<THREE.Mesh>;
  }): React.ReactElement;


  
}
