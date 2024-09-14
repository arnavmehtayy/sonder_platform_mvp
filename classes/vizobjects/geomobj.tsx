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


/*
 * This class creates a geometric object on the scene (Any object that is rendered using THREE.BufferGeometry).
 */


export interface geomobjconstructor extends TransformObjConstructor {
  color?: string;
  geom: THREE.BufferGeometry;
  param_t?: number;
  isClickable?: boolean;
  OnClick?: ((obj: geomobj) => void) | undefined;
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
  }: Partial<geomobjconstructor> & { geom: THREE.BufferGeometry; id: number }) {
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

  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newObject: geomobj) => void;
  }): React.ReactElement {
    const [editedObject, setEditedObject] = React.useState<geomobjconstructor>({
      id: Date.now(), // Generate a temporary ID
      name: "",
      isEnabled: true,
      position: new THREE.Vector2(0, 0),
      rotation: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(2, 2, 2),
      color: "#000000",
      geom: new THREE.BufferGeometry(),
      touch_controls: new TouchControl(),
      param_t: 0,
      isClickable: false,
    });

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
        onSave(newObj);
      },
      title: `Create New Object`,
      fields: [
        { key: "name", label: "Name", type: "text" },
        {
          key: "geom",
          label: "Geometry",
          type: "select",
          options: [
            
            { label: "Circle", value: new THREE.CircleGeometry() },
            { label: "Box", value: new THREE.BoxGeometry() },
            {
              label: "Triangle",
              value: new THREE.Triangle(
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(0, 1, 0)
              ),
            },
          ],
        },
        { key: "color", label: "Color", type: "color" },
        { key: "position", label: "Position", type: "position" },
        { key: "rotation", label: "Rotation", type: "rotation" },
        {
          key: "touch_controls",
          label: "Touch Controls",
          type: "custom",
          render: (value, onChange) => (
            <TouchControlEditor
              touchControl={value}
              onChange={onChange}
            />
          ),
        },
        { key: "isEnabled", label: "IsVisible", type: "checkbox" },

        
      ],
    };

    return <EditableObjectPopup {...popupProps} />;
  }
}

interface TouchControlEditorProps {
  touchControl: TouchControl;
  onChange: (touchControl: TouchControl) => void;
}

function TouchControlEditor({ touchControl, onChange }: TouchControlEditorProps) {
  const updateTouchControl = (key: keyof TouchControl, value: any) => {
    onChange(new TouchControl({ ...touchControl, [key]: value }));
  };

  return (
    <div>
      <TouchControlAttributeEditor
        label="Scale"
        attributes={touchControl.scale}
        onChange={(value) => updateTouchControl("scale", value)}
      />
      <TouchControlAttributeEditor
        label="Rotate"
        attributes={touchControl.rotate}
        onChange={(value) => updateTouchControl("rotate", value)}
      />
      <TouchControlAttributeEditor
        label="Translate"
        attributes={touchControl.translate}
        onChange={(value) => updateTouchControl("translate", value)}
      />
    </div>
  );
}



interface TouchControlAttributeEditorProps {
  label: string;
  attributes: TouchControlAttributes | null;
  onChange: (attributes: TouchControlAttributes | null) => void;
}
export function TouchControlAttributeEditor({
  label,
  attributes,
  onChange,
}: TouchControlAttributeEditorProps) {
  const updateAttributes = (key: keyof NonNullable<TouchControlAttributes>, value: any) => {
    if (attributes === null) {
      onChange({
        direction: [false, false, false],
        step_size: 0.1,
        [key]: value
      });
    } else {
      onChange({ ...attributes, [key]: value });
    }
  };

  return (
    <div className="mb-8 p-4 border rounded-lg shadow-sm">
      <label className="block mb-2 font-semibold">{label}</label>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={attributes !== null}
            onCheckedChange={(checked) =>
              onChange(checked ? {
                direction: [false, false, false],
                step_size: 0.1
              } : null)
            }
          />
          <Label>Enabled</Label>
        </div>

        {attributes !== null && (
          <>
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <Label className="font-medium">Direction</Label>
              <div className="flex space-x-4">
                {['X', 'Y', 'Z'].map((axis, index) => (
                  <div key={axis} className="flex items-center space-x-2">
                    <Checkbox
                      checked={attributes.direction[index]}
                      onCheckedChange={(checked) => {
                        const newDirection = [...attributes.direction];
                        newDirection[index] = checked as boolean;
                        updateAttributes("direction", newDirection);
                      }}
                    />
                    <Label>{axis}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

           

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label className="font-medium">Step Size: {attributes.step_size.toFixed(2)}</Label>
              <Slider
                value={[attributes.step_size]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={([value]) => updateAttributes("step_size", value)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
