import React from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import {
  EditableObjectPopup,
  EditableObjectPopupProps,
} from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import { obj_atts,  get_attributes, dict_keys} from "./get_set_obj_attributes";

/*
    This is the base class for every object in the scene.
    This class is used to store the information about a object in the threejs scene
    The attributes of this class are: id, name, isClickable, isEnabled
*/

export type object_types = "Obj" | "ColoredObj" | "CoordinateAxis" | "DummyDataStorage" | "FunctionPlot" | "FunctionPlotString" | 
"GeomObj" | "LineObj" | "TextGeomObj" | "TransformObj" | "DummyDataStorage"
export interface objconstructor {
  id: number;
  name: string;
  isEnabled?: boolean;
  type?: object_types
}


export class obj {
  id: number;
  name: string;
  isClickable: boolean = false; // whether the object on the screen can be clicked or not
  isEnabled: boolean; // whether the object can be visible or not
  type: object_types // the type of object

  constructor({ id, name, isEnabled = true }: objconstructor) {
    this.type = "Obj";
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
    return newObj;
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

  get_set_att_selector(type: dict_keys): {[key: string]: get_attributes<any, any>} {
    return obj_atts[type]
  }

  dataBaseSave(): objconstructor 
  {
    return {
      id: this.id,
      name: this.name,
      isEnabled: this.isEnabled,
      type: 'Obj'
    }
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



  // method for teh popup that a editing user will use to populate the object
  // this is used by the editing system

  // getPopup<T extends objconstructor>({
  //   setState,
  //   state,
  //   handleAdd
  // }: {
  //   setState: React.Dispatch<React.SetStateAction<T>>;
  //   state: T;
  //   handleAdd: (obj: T) => void;
  // }): React.ReactElement {
  //   return <div></div>;
  // }

  // static getPopup({
  //   isOpen,
  //   onClose,
  //   onSave,
  // }: {
  //   isOpen: boolean;
  //   onClose: () => void;
  //   onSave: (newObject: obj) => void;
  // }): React.ReactElement {
  //   const editedObject = {
  //     id: 0, // Generate a temporary ID
  //     name: "",
  //     isEnabled: true,
  //   };

  //   const popupProps: EditableObjectPopupProps<objconstructor> = {
  //     isOpen,
  //     onClose,
  //     object: editedObject,
  //     onSave: (updatedObject: objconstructor) => {
  //       const newObj = new obj(updatedObject);
  //       onSave(newObj);
  //     },
  //     title: `Create New Object`,
  //     fields: [
  //       { key: "id", label: "ID", type: "number" },
  //       { key: "name", label: "Name", type: "text" },
  //       { key: "isEnabled", label: "Enabled", type: "checkbox" },
  //     ],
  //   };

  //   return <EditableObjectPopup {...popupProps} />;
  // }
}
