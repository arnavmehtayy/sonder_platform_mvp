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
import { Showobj } from "./three/ShowObjs/Showobj";
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
import { useThree } from "@react-three/fiber";

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
  // const { camera_pos } = useControls("cam", {
  //   camera_pos: {
  //     value: [0, 0, 20],
  //     step: 0.1,
  //   },
  // });

  // const { gridSize, ...gridConfig } = useControls({
  //   gridSize: [10.5, 10.5],
  //   cellSize: { value: 1, min: 0, max: 10, step: 0.1 },
  //   cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
  //   cellColor: "#6f6f6f",
  //   sectionSize: { value: 2, min: 0, max: 10, step: 0.1 },
  //   sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
  //   sectionColor: "#9d4b4b",
  //   fadeDistance: { value: 100, min: 0, max: 200, step: 1 },
  //   fadeStrength: { value: 1, min: 0, max: 2, step: 0.1 },
  //   followCamera: false,
  //   infiniteGrid: true,
  // });

  return (
    <>
      <Canvas>
        <OrthographicCamera
          makeDefault
          zoom={25}
          position={[0, 0, 20]}
          near={0.1}
          far={1000}
        />

        <OrbitControls
          enableRotate={false}
          enablePan={true}
          enableZoom={true}
          maxZoom={100}
          minZoom={17}
          dampingFactor={0.3} // Disable damping
          zoomSpeed={0.8}
          panSpeed={0.7}
          mouseButtons={{
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE,
          }}
          touches={{
            ONE: THREE.TOUCH.PAN,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
          makeDefault
        />

        {placement ? (
          <PlacementControl
            gridSize={placement.grid}
            cellSize={placement.cellSize}
            obj_ids={placement.object_ids}
            geom={placement.geometry}
            GridVectors={placement.gridVectors}
            color={placement.color}
          />
        ) : null}

        <>
          {objectlist.map((obj, index) => (
            <Showobj key={index} id={obj.id} />
          ))}
        </>

        {/* <Stats /> */}
      </Canvas>
    </>
  );
}
