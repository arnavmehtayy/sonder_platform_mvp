import { useStore, getObjectSelector, SelectObjectControl } from "@/app/store";
import React, { memo, useRef, useState, useEffect } from "react";
import coloredObj from "@/classes/vizobjects/coloredObj";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo } from "react";
import { TransformObj } from "@/classes/vizobjects/transformObj";

/*
 * This component handles the rendering of a single object in the scene.
 * It takes in an id and renders the object with that id.
 * It uses memo to prevent unnecessary re-renders.
 * Note: Only ColoredObj can be rendered, since they have a getMesh methods.
 */

export const Showobj = memo(function Showobj({ id }: { id: number }) {
  const obj = useStore(getObjectSelector(id)) as TransformObj;
  const selectionModeActive = useStore((state) => state.isSelectActive);
  const object_ref = React.useRef<THREE.Mesh>(null);
  const add_obj = useStore(SelectObjectControl(obj.id));

  const onClickSelect = (event: ThreeEvent<MouseEvent>) => {
    add_obj(); // add the object to any select object lists if they are active (storage system)
    event.stopPropagation();
  };

  const material = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({
      color: obj.color,
      side: THREE.DoubleSide,
    });

    if (selectionModeActive && !obj.isClickable) {
      // if the selection mode is on and the object is not clickable, make it really dark
      mat.color.setHSL(0, 0, mat.color.getHSL({ h: 0, s: 0, l: 0 }).l * 0.1);
      mat.transparent = true;
      mat.opacity = 0.3;
    }

    return mat;
  }, [obj.color, selectionModeActive, obj.isClickable]);

  return obj.isEnabled
    ? obj.getMesh({
        objectRef: object_ref,
        children: <></>,
        onClickSelect: onClickSelect,
        material: material,
      })
    : null;
});
