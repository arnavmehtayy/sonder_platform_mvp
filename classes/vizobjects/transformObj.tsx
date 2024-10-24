import * as THREE from "three";
import { TouchControl } from "../Controls/TouchControl";
import coloredObj from "./coloredObj";
import React from "react";
import { EditableObjectPopup, EditableObjectPopupProps } from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import { coloredObjConstructor } from "./coloredObj";
import { ThreeEvent } from "@react-three/fiber";
import { RefObject } from "react";
import { ReactElement, JSXElementConstructor } from "react";
import { color } from "framer-motion";
import { transform_atts,  get_attributes, dict_keys} from "./get_set_obj_attributes";



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
  }: TransformObjConstructor) {
    super({ id: id, name: name, color: color, isEnabled: isEnabled });
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.touch_controls = touch_controls;
    this.type = "TransformObj";
  }

  get_set_att_selector(type: dict_keys): {[key: string]: get_attributes<any, any>} {
    return { ...transform_atts[type]}
  }

  dataBaseSave(): TransformObjConstructor  {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      isEnabled: this.isEnabled,
      position: this.position,
      rotation: this.rotation,
      scale: this.scale,
      touch_controls: this.touch_controls,
      type: 'TransformObj'
    };
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
