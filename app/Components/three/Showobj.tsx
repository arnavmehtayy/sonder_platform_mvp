import * as THREE from "three";
import { useStore, getObjectSelector } from "@/app/store";
import { shallow } from "zustand/shallow";
import React, { memo, useRef, useState, useEffect } from "react";
import { TransformControls } from "@react-three/drei";

/*
  * This component handles the rendering of a single object in the scene.
  * It takes in an id and renders the object with that id.
  * If the object is not found, it logs an error to the console.
  * This component is used in the Experience component.
  * It uses memo to prevent unnecessary re-renders.


*/

export const Showobj = memo(({ id }: { id: number }) => {
  const obj = useStore(getObjectSelector(id));
  const object_ref = useRef<THREE.Mesh>(null);
  const [controlsEnabled, setControlsEnabled] = useState(false); // used to control when the TransformControls are enabled

  useEffect(() => {
    if (object_ref.current) {
      setControlsEnabled(true);
    }
  }, [object_ref.current]); // Enable controls when the object has been loaded i.e has a non-null reference

  if (!obj) {
    console.log("No object found for id Showobj: ", id);
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
      {controlsEnabled && object_ref.current && (
        <TransformControls
          onObjectChange={() => console.log("moved " + id.toString())}
          showZ={false}
          object={object_ref.current}
        />
      )}
      {/* we are adding object_ref.current to the and condition to keep typescript happy */}
    </>
  );
});
