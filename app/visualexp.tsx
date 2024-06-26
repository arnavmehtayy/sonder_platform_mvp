// components/experience.tsx
"use client";
import React, { useRef, useState, useEffect } from "react";
import { useControls, button } from "leva";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrthographicCamera,
  OrbitControls,
  PerspectiveCamera,
  MapControls,
  TransformControls,
  Stats,
} from "@react-three/drei";
import * as THREE from "three";
import { cameraPosition } from "three/examples/jsm/nodes/Nodes.js";

function CameraHelper() {
  const camera = new THREE.OrthographicCamera(20, -20, 20, -20, 1, 100);
  return <cameraHelper args={[camera]} />;
}

export default function Experience() {
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    // This code only runs on the client-side
    if (typeof window !== 'undefined') {
      const aspect = window.innerWidth / window.innerHeight;
      setAspectRatio(aspect);
    }
  }, []); 
  // const aspect = window.innerWidth / window.innerHeight;
  const { camera_pos } = useControls("cam", {
    camera_pos: {
      value: [0, 0, 10],
      step: 0.1,
    },
  });

  return (
    <Canvas>
      <OrthographicCamera
        makeDefault
        zoom={1}
        top={20}
        bottom={-20}
        left={20 * aspectRatio}
        right={-20 * aspectRatio}
        position={camera_pos}
      />

      <OrbitControls
        enableRotate={false} // Disable rotation
        enablePan={true} // Enable panning
        enableZoom={true} // Enable zooming
        maxZoom={1000} // Max zoom limit
        minZoom={0.1} // Min zoom limit
        
      />
      {/* <OrbitControls /> */}
      <axesHelper args={[5]} />
      <mesh position={[10, 2, 0]} scale={2} rotation-x={0 }>
        <torusGeometry args={[1, 0.5, 16, 100]} />
        <meshBasicMaterial color="orange" side={THREE.DoubleSide} />
      </mesh>

      <mesh position-y={1} rotation-y={0} scale={10}>
        <planeGeometry />
        <meshBasicMaterial color="greenyellow" side={THREE.DoubleSide} />
      </mesh>
      {/* <mesh position-y={1} rotation-z={-Math.PI / 2} scale={10}>
        <planeGeometry />
        <meshBasicMaterial color="blue" side={THREE.DoubleSide} />
      </mesh>
      <mesh position-y={1} rotation-x={-Math.PI / 2} scale={10}>
        <planeGeometry />
        <meshBasicMaterial color="red" side={THREE.DoubleSide} />
      </mesh> */}

      <Stats />
    </Canvas>
  );
}
