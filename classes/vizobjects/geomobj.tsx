import { TransformObj } from "./transformObj";
import * as THREE from "three";
import { TouchControl } from "../Controls/TouchControl";
import { ThreeEvent } from "react-three-fiber";
import coloredObj from "./coloredObj";
import {
  EditableObjectPopup,
  EditableObjectPopupProps,
} from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import React from "react";
import GeneralTransformControl from "@/app/Components/three/GeneralTransCont";

/*
 * This class creates a geometric object on the scene (Any object that is rendered using THREE.BufferGeometry).
 */

interface geomobjconstructor {
  id: number;
  position: THREE.Vector2;
  rotation: THREE.Vector3;
  scale: THREE.Vector3;
  color: string;
  geom: THREE.BufferGeometry;
  touch_controls: TouchControl;
  param_t: number;
  isClickable: boolean;
  OnClick: ((obj: geomobj) => void) | undefined;
  isEnabled: boolean;
  name: string;
}

export class geomobj extends TransformObj {
  geom: THREE.BufferGeometry; // the geometry of the object
  isClickable: boolean = false; // whether the object on the screen can be clicked or not
  OnClick: ((obj: geomobj) => void) | undefined;
  constructor({
    id,
    position = new THREE.Vector2(0, 0),
    rotation = new THREE.Vector3(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    color = "blue",
    geom, // geom remains a required parameter
    touch_controls = new TouchControl(),
    param_t = 0, // the parametric parameter if the object is following a parametric object
    OnClick = undefined,
    isEnabled = true,
    name = "geomobj",
  }: Partial<geomobj> & { geom: THREE.BufferGeometry; id: number }) {
    super({
      position: position,
      rotation: rotation,
      scale: scale,
      touch_controls: touch_controls,
      id: id,
      color: color,
      isEnabled: isEnabled,
      name: name,
    });
    this.geom = geom;
    this.OnClick = OnClick;
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
    children: React.ReactElement | null;
    objectRef: React.RefObject<THREE.Mesh>;
  }): React.ReactElement {
    return (
      <>
        <mesh
          position={[this.position.x, this.position.y, 0]}
          rotation={[this.rotation.x, this.rotation.y, this.rotation.z]}
          scale={[this.scale.x, this.scale.y, this.scale.z]}
          ref={objectRef}
          onPointerDown={this.isClickable ? onClickSelect : undefined}
        >
          <primitive object={this.geom} attach="geometry" />
          {material ? (
            <primitive object={material} attach="material" />
          ) : (
            <meshBasicMaterial color={this.color} side={THREE.DoubleSide} />
          )}
        </mesh>

        {this.touch_controls.scale && (
          <GeneralTransformControl
            mode="scale"
            vizObjId={this.id}
            touchControl={this.touch_controls.scale}
            obj_ref={objectRef}
          />
        )}
        {this.touch_controls.rotate && (
          <GeneralTransformControl
            mode="rotate"
            vizObjId={this.id}
            touchControl={this.touch_controls.rotate}
            obj_ref={objectRef}
          />
        )}
        {this.touch_controls.translate && (
          <GeneralTransformControl
            mode="translate"
            vizObjId={this.id}
            touchControl={this.touch_controls.translate}
            obj_ref={objectRef}
          />
        )}
      </>
    );
  }

  // static getPopup({
  //   isOpen,
  //   onClose,
  //   onSave,
  // }: {
  //   isOpen: boolean;
  //   onClose: () => void;
  //   onSave: (newObject: obj) => void;
  // }): React.ReactElement {
  //   const [editedObject, setEditedObject] = React.useState<objconstructor>({
  //     id: Date.now(), // Generate a temporary ID
  //     name: '',
  //     isEnabled: true,
  //   });

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
  //       { key: 'id', label: 'ID', type: 'number'},
  //       { key: 'name', label: 'Name', type: 'text' },
  //       { key: 'isEnabled', label: 'Enabled', type: 'checkbox' },
  //     ],
  //   };

  //   return <EditableObjectPopup {...popupProps} />;
  // }
}
