import * as THREE from "three";
import { Interactobj } from "@/classes/interactobj";
import { vizobj } from "@/classes/vizobj";
import { useState } from "react";
import { rotate } from "three/examples/jsm/nodes/Nodes.js";

// This is the main component that returns a single visual object as an output

export function Showobj({ vizobj, contnum }: { vizobj: vizobj, contnum: number }) {
  const control: Interactobj | null = vizobj.control;

  if (control === null) {
    // when we have no interaction
    return (
      <mesh position={[vizobj.position.x, vizobj.position.y, 0]}>
        <primitive object={vizobj.geom} attach="geometry" />
        <meshBasicMaterial color={vizobj.color} />
      </mesh>
    );
  }

  switch (control?.action) {
    case "scale":
      return (
        <mesh
          position={[vizobj.position.x, vizobj.position.y, 0]}
          scale={[contnum, 0, 0]}
        >
          <primitive object={vizobj.geom} attach="geometry" />
          <meshBasicMaterial color={vizobj.color} />
        </mesh>
      );

    case "rotate":
      return (
        <mesh
          position={[vizobj.position.x, vizobj.position.y, 0]}
          rotation={[contnum, 0, 0]}
        >
          <primitive object={vizobj.geom} attach="geometry" />
          <meshBasicMaterial color={vizobj.color} />
        </mesh>
      );

    case "move":
      return (
        <mesh position={[contnum, vizobj.position.y, 0]}>
          <primitive object={vizobj.geom} attach="geometry" />
          <meshBasicMaterial color={vizobj.color} />
        </mesh>
      );
  }
}
