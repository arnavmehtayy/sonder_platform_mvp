import CoordinateAxis from "@/classes/vizobjects/CoordinateAxis";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useStore } from "@/app/store";

export default function ShowAxis({
  obj,
  material,
}: {
  obj: CoordinateAxis;
  material: THREE.MeshBasicMaterial;
}) {
  const object_ref = useRef<any>(null);
  const selectionModeActive = useStore((state) => state.isSelectActive);

  return obj.getMesh({
    objectRef: object_ref,
    children: null,
    onClickSelect: (event: any) => {},
    material: material,
  });
  // the axis is not clickable
}
