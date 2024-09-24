'use client'

import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { TransformControls } from "@react-three/drei";
import * as THREE from "three";
import { TouchControl } from "@/classes/Controls/TouchControl";
import { useStore, setVizObjSelector2, getObjectSelector } from "@/app/store";
import { TransformObj } from "@/classes/vizobjects/transformObj";
import { geomobj } from "@/classes/vizobjects/geomobj";
import { useIsMobile } from "@/app/useIsMobile";

/*
 * This component handles a TranformControl for a single object in the scene.
 * It is used to scale, rotate or translate the object. using the drei TransformControls
*/

type GeneralTransformControlProps = { 
  mode: "scale" | "rotate" | "translate"; 
  vizObjId: number; // id of the object that should be controlled using this Transform
  touchControl: { direction: boolean[]; step_size: number } | null; 
  obj_ref: React.RefObject<THREE.Mesh>; // reference to the object that should be controlled using this Transform
};

export default function GeneralTransformControl({
  mode,
  vizObjId,
  touchControl,
  obj_ref,
}: GeneralTransformControlProps) {
  const setVizObj = useStore(setVizObjSelector2(vizObjId));
  const obj = useStore(getObjectSelector(vizObjId)) as TransformObj;
  const [isReady, setIsReady] = useState(false);
  const isMobile = useIsMobile(); // larger arrows for mobile so that it can be dragged easily

  useEffect(() => {
    // checking if we can attach a tranform to our object that is its ref is non-null
    if (obj_ref.current && obj_ref.current.parent) {
      setIsReady(true);
    }
  }, [obj_ref]); 


  // make sure the object changes using transforms are reflected in the store
  const handleTransformationChange = useDebouncedCallback(() => {  
    // this debounces the function so that it is not called too often so that influences arent updated every frame
    if (obj_ref && obj_ref.current && obj) {
      let transformValue: THREE.Vector3;
      let updatedObj: TransformObj;
      switch (mode) {
        case "scale":
          transformValue = obj_ref.current.scale;
          updatedObj = TouchControl.populate_vizobj({
            vizobj: obj,
            scale: transformValue,
          });
          break;
        case "rotate":
          transformValue = new THREE.Vector3(
            obj_ref.current.rotation.x,
            obj_ref.current.rotation.y,
            obj_ref.current.rotation.z
          );
          updatedObj = TouchControl.populate_vizobj({
            vizobj: obj,
            rotation: transformValue,
          });
          break;
        case "translate":
          transformValue = obj_ref.current.position;
          updatedObj = TouchControl.populate_vizobj({
            vizobj: obj,
            position: transformValue,
          });
          break;
      }

      setVizObj(updatedObj);
    }
  }, 0);

  useEffect(() => {
    // This effect ensures that the store updates when the ref object changes
    handleTransformationChange(); 
  }, [obj_ref, handleTransformationChange]);

  if (!touchControl || !obj_ref.current) {
    // console.log("No object found for id GeneralTransformControl: ", vizObjId);
    return null;
  }

  if (!isReady || !touchControl || !obj_ref.current) {
    return null;
  }

  return (
    <TransformControls
      onObjectChange={handleTransformationChange}
      showX={touchControl.direction[0]}
      showY={touchControl.direction[1]}
      showZ={touchControl.direction[2]}
      object={obj_ref.current}
      mode={mode}
      translationSnap={touchControl.step_size}
      rotationSnap={touchControl.step_size}
      scaleSnap={touchControl.step_size}
      size={isMobile ? 2 : 1}
    />
  );
}
