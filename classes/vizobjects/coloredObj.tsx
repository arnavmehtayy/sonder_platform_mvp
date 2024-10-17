import {obj } from "./obj";
import React from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import { objconstructor } from "./obj";
import { color_atts,  get_attributes, dict_keys} from "./get_set_obj_attributes";
/*
 * This class is used to create a colored object in the scene.
*/

export interface coloredObjConstructor extends objconstructor {
  color?: string;
}

export default abstract class coloredObj extends obj {

  color: string;

  constructor({
    id,
    name = "TransformObj",
    color = "#FFFFFF",
    isEnabled = true,
  }: coloredObjConstructor) {
    super({ id: id, name: name, isEnabled: isEnabled });
    this.color = color;
    this.type = "ColoredObj";
  }

  get_set_att_selector(type: dict_keys): {[key: string]: get_attributes<any, any>} {
    return {...super.get_set_att_selector(type), ...color_atts[type]}
  }

  dataBaseSave(): coloredObjConstructor {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      isEnabled: this.isEnabled,
      type: "ColoredObj"
    };
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
