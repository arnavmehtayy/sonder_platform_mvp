import * as THREE from "three";
import { TouchControl } from "../Controls/TouchControl";
import coloredObj from "./coloredObj";
import React from "react";
import { EditableObjectPopup, EditableObjectPopupProps } from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import { coloredObjConstructor } from "./coloredObj";
import { get_attributes } from "./obj";
import { ThreeEvent } from "@react-three/fiber";
import { RefObject } from "react";
import { ReactElement, JSXElementConstructor } from "react";


/*
  * This class stores the position, scale and rotation attributes of an object in the scene.
  * This is the ground truth data that is used to render the object in the scene.
  * there is no get mesh method since this object is no representable in the scene.
*/

export interface TransformObjConstructor extends coloredObjConstructor {
  
  position?: THREE.Vector2;
  rotation?: THREE.Vector3;
  scale?: THREE.Vector3;
  touch_controls?: TouchControl;
}

export abstract class TransformObj extends coloredObj {
  static get_controllable_atts: get_attributes<any, any>[] = [
    ...coloredObj.get_controllable_atts,
    { label: "position", get_attribute: (obj: TransformObj) => obj.position,
      set_attribute: (obj: TransformObj, value: THREE.Vector2) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.position = value;
        return newObj;
      }
    },
    { label: "rotation", get_attribute: (obj: TransformObj) => obj.rotation,
      set_attribute: (obj: TransformObj, value: THREE.Vector3) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.rotation = value;
        return newObj;
      }
    },
    { label: "scale", get_attribute: (obj: TransformObj) => obj.scale,
      set_attribute: (obj: TransformObj, value: THREE.Vector3) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.scale = value;
        return newObj;
      }
    },
    
  ];
  position: THREE.Vector2;
  rotation: THREE.Vector3;
  scale: THREE.Vector3;
  touch_controls: TouchControl;
  param_t: number = 0; // if we have a parametric curve, this is the parameter value. Do not use it directly

  constructor({
    id,
    position = new THREE.Vector2(0, 0),
    rotation = new THREE.Vector3(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    touch_controls = new TouchControl(),
    color = "white",
    name = "TransformObj",
    isEnabled = true,
  }: Partial<TransformObjConstructor> & { id: number }) {
    super({ id: id, name: name, color: color, isEnabled: isEnabled });
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.touch_controls = touch_controls;
  }

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
