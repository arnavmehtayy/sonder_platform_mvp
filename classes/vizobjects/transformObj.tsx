import * as THREE from "three";
import { TouchControl } from "../Controls/TouchControl";
import coloredObj from "./coloredObj";
import React from "react";
import { EditableObjectPopup, EditableObjectPopupProps } from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import { coloredObjConstructor } from "./coloredObj";
import { get_attributes } from "./obj";

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

export class TransformObj extends coloredObj {
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

  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newObject: TransformObj) => void;
  }): React.ReactElement {
    const [editedObject, setEditedObject] = React.useState<TransformObjConstructor>({
      id: 0,
      name: "TransformObj",
      color: "white",
      isEnabled: true,
      position: new THREE.Vector2(0, 0),
      rotation: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1),
      touch_controls: new TouchControl(),
    });

    
    const popupProps: EditableObjectPopupProps<TransformObjConstructor> = {
      isOpen,
      onClose,
      object: editedObject,
      onSave: (updatedObject: TransformObjConstructor) => {
        const newObj = new TransformObj(updatedObject);
        onSave(newObj);
      },
      title: `Create New Object`,
      fields: [
        { key: 'id', label: 'ID', type: 'number'},
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'isEnabled', label: 'Enabled', type: 'checkbox' },

      ],
    };

    return <EditableObjectPopup {...popupProps} />;
  }

  
}
