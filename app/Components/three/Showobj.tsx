import * as THREE from "three";
import { useEffect, useState } from "react";
import { Interactobj } from "@/classes/interactobj";
import { vizobj } from "@/classes/vizobj";

export function Showobj({ vizobj, contnum }: { vizobj: vizobj, contnum: number }) {
  const { control } = vizobj;

  if (!control) {
    // Handle the no interaction case
    return (
      <mesh position={[vizobj.position.x, vizobj.position.y, 0]}>
        <primitive object={vizobj.geom} attach="geometry" />
        <meshBasicMaterial color={vizobj.color} />
      </mesh>
    );
  }

  // Compute transformations based on control.action
  let position: [number, number, number] = [vizobj.position.x, vizobj.position.y, 0];
  let scale: [number, number, number] = [1, 1, 1];
  let rotation: [number, number, number] = [0, 0, 0];

  switch (control.action) {
    case "scale":
      scale = [contnum, 1, 1];
      break;
    case "rotate":
      rotation = [contnum, 0, 0];
      break;
    case "move":
      position = [contnum, vizobj.position.y, 0];
      break;
  }

  // Render the mesh using computed properties
  return (
    <mesh position={position} scale={scale} rotation={rotation}>
      <primitive object={vizobj.geom} attach="geometry" />
      <meshBasicMaterial color={vizobj.color} />
    </mesh>
  );
}
