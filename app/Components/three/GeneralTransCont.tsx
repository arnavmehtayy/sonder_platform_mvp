import React, { forwardRef, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { TransformControls } from "@react-three/drei";
import * as THREE from "three";
import { TouchControl } from "@/classes/TouchControl";
import { vizobj } from "@/classes/vizobj";
import { useStore, setVizObjSelector, getObjectSelector } from "@/app/store";

type GeneralTransformControlProps = {
  mode: "scale" | "rotate" | "translate";
  vizObjId: number;
  touchControl: { direction: boolean[]; step_size: number } | null;
};

export const GeneralTransformControl = forwardRef<
  THREE.Mesh,
  GeneralTransformControlProps
>(({ mode, vizObjId, touchControl }, ref) => {
  const setVizObj = useStore(setVizObjSelector);
  const obj = useStore(getObjectSelector(vizObjId));

  const handleTransformationChange = useDebouncedCallback(() => {
    if (ref && "current" in ref && ref.current && obj) {
      let transformValue: THREE.Vector3;
      let updatedObj: vizobj;
      switch (mode) {
        case "scale":
          transformValue = ref.current.scale;
          updatedObj = TouchControl.populate_vizobj({
            vizobj: obj,
            scale: transformValue,
          });
          break;
        case "rotate":
          transformValue = new THREE.Vector3(
            ref.current.rotation.x,
            ref.current.rotation.y,
            ref.current.rotation.z
          );
          updatedObj = TouchControl.populate_vizobj({
            vizobj: obj,
            rotation: transformValue,
          });
          break;
        case "translate":
          transformValue = ref.current.position;
          updatedObj = TouchControl.populate_vizobj({
            vizobj: obj,
            position: transformValue,
          });
          break;
      }

      setVizObj(vizObjId, updatedObj);
    }
  }, 100);

  useEffect(() => {
    // This effect ensures that the TransformControls updates when the ref changes
    handleTransformationChange();
  }, [ref, handleTransformationChange]);

  if (!touchControl || !ref || !("current" in ref) || !ref.current) {
    console.log("No object found for id GeneralTransformControl: ", vizObjId);
    return null;
  }

  return (
    <TransformControls
      onObjectChange={handleTransformationChange}
      showX={touchControl.direction[0]}
      showY={touchControl.direction[1]}
      showZ={touchControl.direction[2]}
      object={ref.current}
      mode={mode}
      translationSnap={touchControl.step_size}
      rotationSnap={touchControl.step_size}
      scaleSnap={touchControl.step_size}
      size={1}
    />
  );
  
});

export default GeneralTransformControl;
