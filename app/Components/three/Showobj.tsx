import * as THREE from "three";
import { useStore, getObjectSelector, setVizObjSelector } from "@/app/store";
import { extend } from "@react-three/fiber";
import React, {
  memo,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  LegacyRef,
} from "react";
import { GeneralTransformControl } from "./GeneralTransCont";
import { Vector3 } from "three";
import { Line } from "@react-three/drei";

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

  // if(id == 1) {
  //   console.log(obj.position)
  // }
  // else {
  //   console.log("render Showobj", id);
  // }

  useEffect(() => {
    if (object_ref.current) {
      setControlsEnabled(true);
    }
  }, [object_ref.current]); // Enable controls when the object has been loaded i.e has a non-null reference

  if (!obj) {
    return null;
  }
  const points = [];
  points.push(new THREE.Vector3(-10, 0, 0));
  points.push(new THREE.Vector3(0, 10, 0));
  points.push(new THREE.Vector3(10, 0, 0));

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <>
      {obj.geom instanceof THREE.BufferGeometry ? (
        <mesh
          position={[obj.position.x, obj.position.y, 0]}
          rotation={[obj.rotation.x, obj.rotation.y, obj.rotation.z]}
          scale={[obj.scale.x, obj.scale.y, obj.scale.z]}
          ref={object_ref}
        >
          <primitive object={obj.geom} attach="geometry" />
          <meshBasicMaterial color={obj.color} />
        </mesh>
      ) : (
        <mesh
          position={[obj.position.x, obj.position.y, 0]}
          rotation={[obj.rotation.x, obj.rotation.y, obj.rotation.z]}
          scale={[obj.scale.x, obj.scale.y, obj.scale.z]}
        >
          <Line
            points={[
              [obj.geom.start.x, obj.geom.start.y, 0],
              [obj.geom.end.x, obj.geom.end.y, 0],
            ]} // Array of points, Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
            color={obj.color} // Default
            lineWidth={obj.geom.line_width} // In pixels (default)
            segments // If true, renders a THREE.LineSegments2. Otherwise, renders a THREE.Line2
            dashed={false} // Default
            {...{linebutt: "round", linecap: "round"}}
          />
          
        </mesh>
      )}
      {/* <mesh
        position={[obj.position.x, obj.position.y, 0]}
        rotation={[obj.rotation.x, obj.rotation.y, obj.rotation.z]}
        scale={[obj.scale.x, obj.scale.y, obj.scale.z]}
      >
        <Line
          points={[
            [0, 0, 0],
            [1, 1, 0],
            [-1, 1, 0],
            [0, 0, 0],
            [1, 2, 1],
            [2, 2, 2],
          ]} // Array of points, Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
          color="red" // Default
          lineWidth={2} // In pixels (default)
          segments // If true, renders a THREE.LineSegments2. Otherwise, renders a THREE.Line2
          dashed={false} // Default
        />
      </mesh> */}
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
      {controlsEnabled && touch_scale && (
        <GeneralTransformControl
          mode="scale"
          vizObjId={id}
          touchControl={obj.touch_controls.scale}
          obj_ref={object_ref}
        />
      )}
      {controlsEnabled && touch_rotate && (
        <GeneralTransformControl
          mode="rotate"
          vizObjId={id}
          touchControl={obj.touch_controls.rotate}
          obj_ref={object_ref}
        />
      )}
      {controlsEnabled && touch_translate && (
        <GeneralTransformControl
          mode="translate"
          vizObjId={id}
          touchControl={obj.touch_controls.translate}
          obj_ref={object_ref}
        />
      )}
    </>
  );
});
