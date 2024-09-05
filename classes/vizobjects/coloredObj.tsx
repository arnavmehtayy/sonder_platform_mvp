import { obj } from "./obj";
import React from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import { objconstructor } from "./obj";
import { EditableObjectPopup, EditableObjectPopupProps } from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";

/*
 * This class is used to create a colored object in the scene.
*/

export interface coloredObjConstructor extends objconstructor {
  color: string;
}

export default class coloredObj extends obj {
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
  getMesh({
    children,
    onClickSelect = (event: ThreeEvent<MouseEvent>) => {},
    objectRef,
    material = null,
  }: Partial<{
    children: React.ReactElement | null;
    onClickSelect: (event: ThreeEvent<MouseEvent>) => void;
    objectRef: React.RefObject<THREE.Mesh>;
    material: THREE.MeshBasicMaterial | null;
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

  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newObject: coloredObj) => void;
  }): React.ReactElement {
    const editedObject: coloredObjConstructor = {
      id: Date.now(), // Generate a temporary ID
      name: '',
      isEnabled: true,
      color: 'white',
    }

    const popupProps: EditableObjectPopupProps<coloredObjConstructor> = {
      isOpen,
      onClose,
      object: editedObject,
      onSave: (updatedObject: coloredObjConstructor) => {
        const newObj = new coloredObj(updatedObject);
        onSave(newObj);
      },
      title: `Create New Object`,
      fields: [
        { key: 'id', label: 'ID', type: 'number'},
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'isEnabled', label: 'Enabled', type: 'checkbox' },
        { key: 'color', label: 'Color', type: 'text' },
      ],
    };

    return <EditableObjectPopup {...popupProps} />;
  }
}
