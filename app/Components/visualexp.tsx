"use client";
import React from "react";
import { useControls } from "leva";
import { Canvas } from "@react-three/fiber";
import { 
  OrthographicCamera,
  OrbitControls,
  Stats,
} from "@react-three/drei";
import { Showobj } from "./three/Showobj";
import { useStore, objectsSelector} from "../store"

/*
  * This component is the main visual experience component.
  * It displays all the objects in the object list
  * and allows the user to interact with the scene.
  * The camera position is controlled by the useControls hook.
*/

// function CameraHelper() {
//   const camera = new THREE.OrthographicCamera(20, -20, 20, -20, 1, 100);
//   return <cameraHelper args={[camera]} />;
// }

export default function Experience() {

  const objectlist = useStore(objectsSelector);
  const { camera_pos } = useControls("cam", {
    camera_pos: {
      value: [0, 0, 2],
      step: 0.1,
    },
  });

  return (
    <Canvas>
      <OrthographicCamera
        makeDefault
        zoom={15} // Zoom level
        // top={20}
        // bottom={-20}
        // left={20 }
        // right={-20 }
        position={camera_pos} // Camera position controls by useControls
      />

      <OrbitControls
        enableRotate={false} // Disable rotation
        enablePan={true} // Enable panning
        enableZoom={true} // Enable zooming
        maxZoom={1000} // Max zoom limit
        minZoom={0.1} // Min zoom limit
      />
      {/* <OrbitControls /> */}
      {/* <axesHelper args={[5]} /> */}

      {/* <mesh position={[10, 2, 0]} scale={2} rotation-x={0}>
        <torusGeometry args={[1, 0.5, 16, 100]} />
        <meshBasicMaterial color="orange" side={THREE.DoubleSide} />
      </mesh>

      <mesh position-y={1} rotation-y={0} scale={10} onClick={onClickCube}>
        <primitive object={new THREE.PlaneGeometry(1, 1)} attach={"geometry"} />
        <meshBasicMaterial color="greenyellow" side={THREE.DoubleSide} />
      </mesh> */}

      {/* <mesh position-y={1} rotation-z={-Math.PI / 2} scale={10}>
        <planeGeometry />
        <meshBasicMaterial color="blue" side={THREE.DoubleSide} />
      </mesh>
      <mesh position-y={1} rotation-x={-Math.PI / 2} scale={10}>
        <planeGeometry />
        <meshBasicMaterial color="red" side={THREE.DoubleSide} />
      </mesh> */}

      <>
        { objectlist.map((obj, index) =>
          <Showobj key={index} id={obj.id}/> 
        )} 
        {/* Show all objects in the object list */}
      </>

      <Stats /> 
      {/* Display performance stats */}
    </Canvas> 
  );
}
