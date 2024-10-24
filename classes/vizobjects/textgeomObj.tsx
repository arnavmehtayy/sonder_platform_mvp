import { geomobj, geomobjconstructor } from "./geomobj";
import * as THREE from "three";
import { TouchControl } from "../Controls/TouchControl";
import { ThreeEvent } from "react-three-fiber";
import { Text } from "@react-three/drei";
import { text_atts, get_attributes, dict_keys } from "./get_set_obj_attributes";
import React from "react";
import {
  EditableObjectPopup,
  EditableObjectPopupProps,
} from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import { TouchControlEditor } from "@/app/Components/EditMode/EditPopups/TouchControlAttributeEditor";
import GeneralTransformControl from "@/app/Components/three/GeneralTransCont";
import { TextGeomInsert, TextGeomSelect } from "@/app/db/schema";

/*
 * This class is used to create a object that has Text on it in the scene.
 */

export interface TextGeomConstructor extends geomobjconstructor {
  text: string;
}
export default class TextGeom extends geomobj {
  text: string;

  constructor({
    id,
    position = new THREE.Vector2(0, 0),
    rotation = new THREE.Vector3(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    color = "blue",
    geom_json, // geom remains a required parameter
    touch_controls = new TouchControl(),
    param_t = 0, // the parametric parameter if the object is following a parametric object
    isClickable = true, // if this is false then this object cannot detect a click at all
    OnClick = undefined,
    text = "", // text on the object
    isEnabled = true,
    name = "TextGeom",
  }: TextGeomConstructor) {
    super({
      name: name,
      id: id,
      position: position,
      rotation: rotation,
      scale: scale,
      color: color,
      touch_controls: touch_controls,
      param_t: param_t,
      isClickable: isClickable,
      OnClick: OnClick,
      isEnabled: isEnabled,
      geom_json: geom_json
    });
    this.text = text;
    this.name = text;
    this.type = "TextGeomObj";
  }

  serialize(): Omit<TextGeomInsert, 'stateId'> {
    return {
      objId: this.id,
      name: this.name,
      color: this.color,
      position_x: this.position.x,
      position_y: this.position.y,
      rotation_x: this.rotation.x,
      rotation_y: this.rotation.y,
      rotation_z: this.rotation.z,
      scale_x: this.scale.x,
      scale_y: this.scale.y,
      scale_z: this.scale.z,
      touch_controls: this.touch_controls,
      geometry_type: this.geom_json.type,
      geometry_atts: this.geom_json.params,
      text: this.text
    };
  }

  static deserialize(data: TextGeomSelect): TextGeom {
    return new TextGeom({
      id: data.objId,
      name: data.name,
      isEnabled: true, // Assuming isEnabled is not stored in the database
      position: new THREE.Vector2(data.position_x, data.position_y),
      rotation: new THREE.Vector3(data.rotation_x, data.rotation_y, data.rotation_z),
      scale: new THREE.Vector3(data.scale_x, data.scale_y, data.scale_z),
      color: data.color,
      touch_controls: data.touch_controls as TouchControl,
      geom_json: {
        type: data.geometry_type,
        params: data.geometry_atts
      },
      text: data.text
    });
  }



  // dataBaseSave(): TextGeomConstructor & { type: string } {
  //   return {
  //     id: this.id,
  //     name: this.name,
  //     position: this.position,
  //     rotation: this.rotation,
  //     scale: this.scale,
  //     color: this.color,
  //     touch_controls: this.touch_controls,
  //     param_t: this.param_t,
  //     isClickable: this.isClickable,
  //     OnClick: this.OnClick,
  //     text: this.text,
  //     isEnabled: this.isEnabled,
  //     type: "TextGeomObj",
  //     geom_json: this.geom_json
  //   };
  // }

  get_set_att_selector(type: dict_keys): {[key: string]: get_attributes<any, any>} {
    return { ...text_atts[type]};
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
    objectRef: React.RefObject<any>;
    material: THREE.Material | null;
  }> & {
    children: React.ReactElement | null;
    objectRef: React.RefObject<THREE.Mesh>;
  }): React.ReactElement {
    return (
      <>
      <group
  ref={objectRef}
  position={[this.position.x, this.position.y, 0]}
  onPointerDown={this.isClickable ? onClickSelect : undefined}
  rotation={[this.rotation.x, this.rotation.y, this.rotation.z]}
  scale={[this.scale.x, this.scale.y, this.scale.z]}
>
  <mesh>
    <primitive object={this.geom} attach="geometry" />
    {material ? (
      <primitive object={material} attach="material" />
    ) : (
      <meshBasicMaterial color={this.color} side={THREE.DoubleSide} />
    )}
  </mesh>
  <Text
    color="white"
    anchorX="center"
    anchorY="middle"
    renderOrder={1}
    maxWidth={this.scale.x * 0.9} // Reduced to 90% of the geometry width
    fontSize={Math.min(this.scale.x, this.scale.y) * 0.4} // Reduced font size
    position={[0, 0, 0.01]} // Slightly in front of the geometry
    textAlign="center"
    overflowWrap="break-word"
    clipRect={[-this.scale.x / 2, -this.scale.y / 2, this.scale.x, this.scale.y]}
    lineHeight={1.2} // Increased line height
    letterSpacing={0} // Removed negative letter spacing
    whiteSpace="normal"
    scale={[1 / this.scale.x, 1 / this.scale.y, 1]}
    material-depthTest={false} // Ensure text renders on top
  >
    {this.text}
  </Text>
</group>
      
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
    //   super.getMesh({
    //     children: (
    //       <>
    //         <Text color="white" anchorX={objectRef.current.position.x} anchorY={objectRef.current.position.y}>
    //           {this.text}
    //         </Text>
    //       </>
    //     ),
    //     onClickSelect: onClickSelect,
    //     objectRef: objectRef,
    //     material: material,
    //   })
    // );
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
    const [editedObject, setEditedObject] = React.useState<TextGeomConstructor>(
      {
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
        text: "test",
        geom_json: {type: 'circle', params: {radius: 1}}
      }
    );

    const handleChange = (key: keyof TextGeomConstructor, value: any) => {
      setEditedObject((prev) => ({ ...prev, [key]: value }));
    };

    const popupProps: EditableObjectPopupProps<TextGeomConstructor> = {
      isOpen,
      onClose,
      object: editedObject,
      set_object: setEditedObject,
      onSave: (updatedObject: TextGeomConstructor) => {
        const newObj = new TextGeom(updatedObject);
        onSave(newObj);
      },
      title: `Create New Object`,
      fields: [
        { key: "name", label: "Name", type: "text" },
        {
          key: "geom_json",
          label: "Geometry",
          type: "select",
          options: [
            { label: "Circle", value: { type: "circle", params: { radius: 1 } } },
            { label: "Rectangle", value: { type: "rectangle", params: { width: 1, height: 1 } } },
            { label: "Triangle", value: { type: "triangle", params: { sideLength: 1 } } },
            { label: "Regular Polygon", value: { type: "regular-polygon", params: { radius: 1, numSides: 5 } } },
          ],
        },
        { key: "text", label: "Text", type: "text" },
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
    };

    return <EditableObjectPopup {...popupProps} />;
  }
}
