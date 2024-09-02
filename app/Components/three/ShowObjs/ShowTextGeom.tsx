import textgeom from "@/classes/vizobjects/textgeomObj";
import { useRef, useMemo } from "react";
import { useStore, SelectObjectControl } from "@/app/store";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

// This component is responsible for rendering a textgeom on the scene

export default function ShowTextGeom({
  obj,
  material,
}: {
  obj: textgeom;
  material: THREE.MeshBasicMaterial;
}) {
  const object_ref = useRef<THREE.Mesh>(null);
  const add_obj = useStore(SelectObjectControl(obj.id));

  const onClickSelect = (event: ThreeEvent<MouseEvent>) => {
    add_obj();
    event.stopPropagation();
  };

  return obj.getMesh({
    children: null,
    onClickSelect: onClickSelect,
    objectRef: object_ref,
    material: material,
  });

}
