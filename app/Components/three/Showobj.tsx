import * as THREE from "three";
import { useStore, getObjectSelector, setVizObjSelector } from "@/app/store";
import React, { memo, useRef, useState, useEffect } from "react";
import { GeneralTransformControl } from "./GeneralTransCont";

/*
  * This component handles the rendering of a single object in the scene.
  * It takes in an id and renders the object with that id.
  * If the object is not found, it logs an error to the console.
  * This component is used in the Experience component.
  * It uses memo to prevent unnecessary re-renders.


*/

export const Showobj = memo(({ id }: { id: number }) => {
  const obj = useStore(getObjectSelector(id));
  const setVizObj = useStore(setVizObjSelector);
  const object_ref = useRef<THREE.Mesh>(null);
  const [controlsEnabled, setControlsEnabled] = useState(false); // used to control when the TransformControls are enabled
  const touch_scale = obj?.touch_controls.scale;
  const touch_rotate = obj?.touch_controls.rotate;
  const touch_translate = obj?.touch_controls.translate;
  
  if(id == 1) {
    console.log(obj.position)
  }
  else {
    console.log("render Showobj", id);
  }

  useEffect(() => {
    if (object_ref.current) {
      setControlsEnabled(true);
    }
  }, [object_ref.current]); // Enable controls when the object has been loaded i.e has a non-null reference

  if (!obj) {
    return null;
  }
    


  return (
    <>
       <mesh
        position={[obj.position.x, obj.position.y, 0]}
        rotation={[obj.rotation.x, obj.rotation.y, obj.rotation.z]}
        scale={[obj.scale.x, obj.scale.y, obj.scale.z]}
        ref={object_ref}
      >
        <primitive object={obj.geom} attach="geometry" />
        <meshBasicMaterial color={obj.color} />
      </mesh>
      {/*
      {controlsEnabled && object_ref.current && (
        <>
          {touch_scale ? (
            <TransformControls
              onObjectChange={() => handleTransformationChange("scale")}
              showX={touch_scale.direction[0]}
              showY={touch_scale.direction[1]}
              showZ={touch_scale.direction[2]}
              object={object_ref.current}
              mode="scale"
              scaleSnap={touch_scale.step_size}
              size={0.4}
            />
          ) : null}

          {touch_rotate ? (
            <TransformControls
              onObjectChange={() => handleTransformationChange("rotate")}
              showX={touch_rotate.direction[0]}
              showY={touch_rotate.direction[1]}
              showZ={touch_rotate.direction[2]}
              object={object_ref.current}
              mode="rotate"
              rotationSnap={touch_rotate.step_size}
              size={0.4}
            />
          ) : null}

          {touch_translate ? (
            <TransformControls
              onObjectChange={() => handleTransformationChange("translate")}
              showX={touch_translate.direction[0]}
              showY={touch_translate.direction[1]}
              showZ={touch_translate.direction[2]}
              object={object_ref.current}
              mode="translate"
              translationSnap={touch_translate.step_size}
              size={1}
            />
          ) : null}
        </>
      )} */}

      {controlsEnabled && touch_scale && <GeneralTransformControl mode="scale" vizObjId={id} touchControl={obj.touch_controls.scale}  obj_ref={object_ref}/>}
      {controlsEnabled && touch_rotate && <GeneralTransformControl mode="rotate" vizObjId={id} touchControl={obj.touch_controls.rotate} obj_ref={object_ref}/>}
      {controlsEnabled && touch_translate && <GeneralTransformControl mode="translate" vizObjId={id} touchControl={obj.touch_controls.translate}  obj_ref={object_ref}/>}
    </>
  );
});
