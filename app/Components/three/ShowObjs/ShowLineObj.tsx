import { LineObj } from "@/classes/vizobjects/Lineobj";
import { ThreeEvent} from "@react-three/fiber";
import React, { useRef} from "react";
import * as THREE from "three";
import { useStore, SelectObjectControl } from "@/app/store";



// This component is responsible for rendering a LineObj on the scene

export function ShowLineObj({
  obj,
  material,
}: {
  obj: LineObj;
  material: THREE.MeshBasicMaterial;
}) {

  const object_ref = useRef<THREE.Mesh>(null);
  const add_obj = useStore(SelectObjectControl(obj.id));

  const onClickSelect = (event: ThreeEvent<MouseEvent>) => {
    add_obj(); // when the object is clicked pass on this information to the store so that it can update the select controls
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
