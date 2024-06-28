import * as THREE from "three";
import { useEffect, useState } from "react";
import { Interactobj } from "@/classes/interactobj";
import { vizobj } from "@/classes/vizobj";

export function Showobj({ vizobj, contnum }: { vizobj: vizobj, contnum: number }) {
  const control: Interactobj | null = vizobj.control;

  // State to manage transformations
  const [position, setPosition] = useState({ x: vizobj.position.x, y: vizobj.position.y, z: 0 });
  const [scale, setScale] = useState({ x: 1, y: 1, z: 1 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (control) {
      switch (control.action) {
        case "scale":
          setScale({ x: contnum, y: 1, z: 1 });
          break;
        case "rotate":
          setRotation({ x: 0, y: 0, z: contnum });
          break;
        case "move":
          setPosition({ x: contnum, y: vizobj.position.y, z: 0 });
          break;
      }
    }
  }, [contnum, control]); // Dependency array includes control and contnum

  if (!control) {
    // Handle the no interaction case
    return (
      <mesh position={[vizobj.position.x, vizobj.position.y, 0]}>
        <primitive object={vizobj.geom} attach="geometry" />
        <meshBasicMaterial color={vizobj.color} />
      </mesh>
    );
  }

  // Render the mesh using state variables
  return (
    <mesh position={[position.x, position.y, position.z]} scale={[scale.x, scale.y, scale.z]} rotation={[rotation.x, rotation.y, rotation.z]}>
      <primitive object={vizobj.geom} attach="geometry" />
      <meshBasicMaterial color={vizobj.color} />
    </mesh>
  );
}