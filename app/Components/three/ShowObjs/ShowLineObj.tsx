import { LineObj } from "@/classes/vizobjects/Lineobj";
import { Line } from "@react-three/drei";
import { ThreeEvent, useThree } from "@react-three/fiber";
import React, { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useStore, SelectObjectControl } from "@/app/store";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

export function ShowLineObj({
  obj,
  material,
}: {
  obj: LineObj;
  material: THREE.MeshBasicMaterial;
}) {
  const object_ref = useRef<THREE.Mesh>(null);
  const add_obj = useStore(SelectObjectControl(obj.id));
  const selectionModeActive = useStore((state) => state.isSelectActive);

  const onClickSelect = (event: ThreeEvent<MouseEvent>) => {
    add_obj();
    event.stopPropagation();
  };

  return (
    <>
      {obj.getMesh({
        children: null,
        onClickSelect: onClickSelect,
        objectRef: object_ref,
        material: material,
      })}
    </>
  );
}
