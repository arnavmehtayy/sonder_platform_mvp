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
import { TransformObjConstructor } from "./transformObj";
import { TouchControlAttributes } from "../Controls/TouchControl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { dict_keys, get_attributes } from "./get_set_obj_attributes";
import { TouchControlEditor } from "@/app/Components/EditMode/EditPopups/TouchControlAttributeEditor";
import { Validation_obj_constructor, ValidationObjEditor } from "../Validation/Validation_obj";
import Validation_obj from "../Validation/Validation_obj";
import Validation from "../Validation/Validation";

// List of 2D geometries with simple parameters
export type PredefinedGeometry = {
  type: 'circle' | 'rectangle' | 'triangle' | 'regular-polygon';
  params: {
    radius?: number;
    width?: number;
    height?: number;
    sideLength?: number;
    numSides?: number;
  };
};





/*
 * This class creates a geometric object on the scene (Any object that is rendered using THREE.BufferGeometry).
 */

export interface geomobjconstructor extends TransformObjConstructor {
  color?: string;
  geom_json: PredefinedGeometry
  geom?: THREE.BufferGeometry
  param_t?: number;
  isClickable?: boolean;
  OnClick?: ((obj: geomobj) => void) | undefined;
}

export class geomobj extends TransformObj {
  geom: THREE.BufferGeometry; // the geometry of the object
  geom_json: PredefinedGeometry
  isClickable: boolean = false; // whether the object on the screen can be clicked or not
  OnClick: ((obj: geomobj) => void) | undefined;
  constructor({
    id,
    position = new THREE.Vector2(0, 0),
    rotation = new THREE.Vector3(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    color = "blue",
    geom_json,
    // geom_json = {type: 'circle', params: {radius: 2}},
    geom = new THREE.CircleGeometry(1, 32),
    touch_controls = new TouchControl(),
    param_t = 0, // the parametric parameter if the object is following a parametric object
    OnClick = undefined,
    isEnabled = true,
    name = "geomobj",
  }: geomobjconstructor) {
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
    this.geom_json = geom_json
    this.geom = geom_json ? this.createPredefinedGeometry(geom_json): geom;
    this.OnClick = OnClick;
    this.type = "GeomObj";
  }

  private createPredefinedGeometry(geomDef: PredefinedGeometry): THREE.BufferGeometry {
    switch (geomDef.type) {
      case 'circle':
        return new THREE.CircleGeometry(geomDef.params.radius || 1, 32);
      case 'rectangle':
        return new THREE.PlaneGeometry(geomDef.params.width || 1, geomDef.params.height || 1);
      case 'triangle':
        const triangleShape = new THREE.Shape();
        const sideLength = geomDef.params.sideLength || 1;
        triangleShape.moveTo(0, 0);
        triangleShape.lineTo(sideLength, 0);
        triangleShape.lineTo(sideLength / 2, sideLength * Math.sqrt(3) / 2);
        triangleShape.lineTo(0, 0);
        return new THREE.ShapeGeometry(triangleShape);
      case 'regular-polygon':
        const numSides = geomDef.params.numSides || 5;
        const radius = geomDef.params.radius || 1;
        return new THREE.CircleGeometry(radius, numSides);
      default:
        return new THREE.CircleGeometry(1, 32);
    }
  }

  dataBaseSave(): geomobjconstructor {
    return {
      ...super.dataBaseSave(),
      color: this.color,
      param_t: this.param_t,
      isClickable: this.isClickable,
      OnClick: this.OnClick,
      type: "GeomObj",
      geom_json: this.geom_json
    };
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
    material: THREE.Material | null;
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

        {children}

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

  get_set_att_selector(type: dict_keys): {[key: string]: get_attributes<any, any>} {
    return {...super.get_set_att_selector(type)};
  }

  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newObject: geomobj, validation?: Validation_obj<any>) => void;
  }): React.ReactElement {
    const [editedObject, setEditedObject] = React.useState<geomobjconstructor>({
      id: Date.now() % 10000, // Generate a temporary ID
      name: "",
      isEnabled: true,
      position: new THREE.Vector2(0, 0),
      rotation: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(2, 2, 2),
      color: "#000000",
      touch_controls: new TouchControl(),
      param_t: 0,
      isClickable: false,
      geom_json: {type: "circle", params:{radius:1}}
    });
  
    const [validation, setValidation] = React.useState<Validation_obj_constructor<any> | undefined>(undefined);
  
    const handleChange = (key: keyof geomobjconstructor, value: any) => {
      setEditedObject((prev) => ({ ...prev, [key]: value }));
    };
  
    const popupProps: EditableObjectPopupProps<geomobjconstructor> = {
      isOpen,
      onClose,
      object: editedObject,
      set_object: setEditedObject,
      onSave: (updatedObject: geomobjconstructor) => {
        const newObj = new geomobj(updatedObject);
        
        const newVal = validation ? new Validation_obj(validation) : undefined
        onSave(newObj, newVal);
      },
      title: `Create New Geometric Object`,
      fields: [
        { key: "name", label: "Name", type: "text" },
        {
          key: "geom_json",
          label: "Geometry",
          type: "geometry",
        },
        { key: "color", label: "Color", type: "color" },
        { key: "position", label: "Position", type: "position" },
        { key: "rotation", label: "Rotation", type: "rotation" },
        { key: "scale", label: "Scale", type: "vector3" },
        {
          key: "touch_controls",
          label: "Touch Controls",
          type: "custom",
          render: (value, onChange) => (
            <TouchControlEditor touchControl={value} onChange={onChange} />
          ),
        },
        { key: "isEnabled", label: "IsVisible", type: "checkbox" },
      ],
      additionalContent: (
        <ValidationObjEditor
          onChange={(newValidation: Validation_obj_constructor<any> | undefined) => setValidation(newValidation)}
          value={editedObject}
          id={editedObject.id}
        />
      ),
    };
  
    return <EditableObjectPopup {...popupProps} />;
  }

// function TouchControlEditor({ touchControl, onChange }: TouchControlEditorProps) {
//   const updateTouchControl = (key: keyof TouchControl, value: any) => {
//     onChange(new TouchControl({ ...touchControl, [key]: value }));
//   };

//   return (
//     <div>
//       <TouchControlAttributeEditor
//         label="Scale"
//         attributes={touchControl.scale}
//         onChange={(value) => updateTouchControl("scale", value)}
//       />
//       <TouchControlAttributeEditor
//         label="Rotate"
//         attributes={touchControl.rotate}
//         onChange={(value) => updateTouchControl("rotate", value)}
//       />
//       <TouchControlAttributeEditor
//         label="Translate"
//         attributes={touchControl.translate}
//         onChange={(value) => updateTouchControl("translate", value)}
//       />
//     </div>
//   );
// }
}
