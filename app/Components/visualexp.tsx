"use client";
import React from "react";
import { useControls } from "leva";
import { Canvas } from "@react-three/fiber";
import {
  OrthographicCamera,
  OrbitControls,
  Stats,
  Grid,
} from "@react-three/drei";
import { Showobj } from "./three/Showobj";
import { useStore, getObjectsSelector, getPlacementSelector } from "../store";
import * as THREE from "three";
import {
  Bloom,
  Noise,
  Glitch,
  ToneMapping,
  Vignette,
  EffectComposer,
} from "@react-three/postprocessing";
import {
  PlacementProvider,
  PlacementControl,
  PlacementActivationButton,
} from "./three/PlacementControl";

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
  const objectlist = useStore(getObjectsSelector);
  const placement = useStore(getPlacementSelector);
  const { camera_pos } = useControls("cam", {
    camera_pos: {
      value: [0, 0, 20],
      step: 0.1,
    },
  });

  const { gridSize, ...gridConfig } = useControls({
    gridSize: [10.5, 10.5],
    cellSize: { value: 1, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
    cellColor: "#6f6f6f",
    sectionSize: { value: 2, min: 0, max: 10, step: 0.1 },
    sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
    sectionColor: "#9d4b4b",
    fadeDistance: { value: 100, min: 0, max: 200, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 2, step: 0.1 },
    followCamera: false,
    infiniteGrid: true,
  });

  return (
    <>
      {/* <PlacementProvider> */}
      <Canvas>
        {/* <EffectComposer>
      <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} height={300} />
      <Noise opacity={0.02} />
      <ToneMapping adaptive={true} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer> */}
        <OrthographicCamera
          makeDefault
          zoom={15} // Zoom level
          // top={20}
          // bottom={-20}
          // left={20 }
          // right={-20 }
          position={camera_pos} // Camera position controls by useControls
          near={0.1}
          far={1000}
        />

        <OrbitControls
          enableRotate={false} // Disable rotation
          enablePan={true} // Enable panning
          enableZoom={true} // Enable zooming
          maxZoom={100} // Max zoom limit
          minZoom={1} // Min zoom limit
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

        {placement ? (
          <PlacementControl
            gridSize={placement.grid}
            cellSize={placement.cellSize}
            obj_id={placement.object_id}
            geom={placement.geometry}
            GridVectors={placement.gridVectors}
          />
        ) : null}

        <>
          {objectlist.map((obj, index) => (
            <Showobj key={index} id={obj.id} />
          ))}
          {/* Show all objects in the object list */}
        </>

        <Stats />
        {/* <Grid position={[0, 0, -1]} rotation={[Math.PI/2, 0,0]} args={gridSize} {...gridConfig} /> */}
        {/* Display performance stats */}
      </Canvas>
      {/* <PlacementActivationButton />
    
    </PlacementProvider> */}
    </>
  );
}
