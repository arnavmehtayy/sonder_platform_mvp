"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera, OrbitControls } from "@react-three/drei";
import { Showobj } from "./three/Showobj";
import { useStore, getObjectsSelector, getPlacementSelector, getPlacementListSelector, getZoomSelector} from "../store";
import * as THREE from "three";

import { PlacementControl } from "./three/PlacementControl";
import coloredObj from "@/classes/vizobjects/coloredObj";

/*
 * This component is the main visual experience component.
 * It displays all the objects in the object list
 * and allows the user to interact with the scene.
 * The camera position is controlled by the useControls hook.
 */

export default function Experience() {
  
  const objectlist = useStore(getObjectsSelector);
  const placement = useStore(getPlacementListSelector);
  const zoom = useStore(getZoomSelector);
  const minZoom = zoom / 2;
  const maxZoom = zoom + 98;


  return (
    <>
      <Canvas>
        <OrthographicCamera // to allow for 2D camera view
          makeDefault
          zoom={zoom}
          position={[0, 0, 20]}
          near={0.1}
          far={1000}
        />

        <OrbitControls // to allow drag movement for translation and scroll for zoom
          enableRotate={false}
          enablePan={true}
          enableZoom={true}
          maxZoom={maxZoom}
          minZoom={minZoom}
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

        {placement.map((item, index) => (
          <PlacementControl
            key={index}
            placementIndex={item.id}
          />
        ))}

        <>
          {objectlist.map((obj, index) => (
            obj instanceof coloredObj ? (
              <Showobj key={index} obj={obj as coloredObj} />
            ) : null
          ))}
        </>

      </Canvas>
    </>
  );
}
