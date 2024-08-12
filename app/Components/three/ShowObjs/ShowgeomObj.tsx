import React, { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import GeneralTransformControl from "../GeneralTransCont";
import { geomobj } from "@/classes/vizobjects/geomobj";
import { ThreeEvent } from "@react-three/fiber";
import { useStore, SelectObjectControl } from "@/app/store";

export function ShowGeomObj({
  obj,
  material,
}: {
  obj: geomobj;
  material: THREE.MeshBasicMaterial;
}) {
  const object_ref = useRef<THREE.Mesh>(null);
  const [controlsEnabled, setControlsEnabled] = useState(false);
  const add_obj = useStore(SelectObjectControl(obj.id));

  const touch_scale = obj?.touch_controls.scale;
  const touch_rotate = obj?.touch_controls.rotate;
  const touch_translate = obj?.touch_controls.translate;
  const id = obj.id;
  const selectionModeActive = useStore((state) => state.isSelectActive);

  useEffect(() => {
    if (object_ref.current) {
      setControlsEnabled(true);
    }
  }, [object_ref.current]);

  const onClickSelect = (event: ThreeEvent<MouseEvent>) => {
    add_obj();
    event.stopPropagation();
  };

  return (
    <>
      {/* <mesh
        position={[obj.position.x, obj.position.y, 0]}
        rotation={[obj.rotation.x, obj.rotation.y, obj.rotation.z]}
        scale={[obj.scale.x, obj.scale.y, obj.scale.z]}
        ref={object_ref}
        onClick={obj.isClickable ? onClickSelect : undefined}
      >
        <primitive object={obj.geom} attach="geometry" />
        <meshBasicMaterial color={obj.color} side={THREE.DoubleSide} />
      </mesh> */}

      {obj.getMesh({
        children: null,
        onClickSelect: onClickSelect,
        objectRef: object_ref,
        material: material,
      })}

      {controlsEnabled && touch_scale && (
        <GeneralTransformControl
          mode="scale"
          vizObjId={id}
          touchControl={obj.touch_controls.scale}
          obj_ref={object_ref}
        />
      )}
      {controlsEnabled && touch_rotate && (
        <GeneralTransformControl
          mode="rotate"
          vizObjId={id}
          touchControl={obj.touch_controls.rotate}
          obj_ref={object_ref}
        />
      )}
      {controlsEnabled && touch_translate && (
        <GeneralTransformControl
          mode="translate"
          vizObjId={id}
          touchControl={obj.touch_controls.translate}
          obj_ref={object_ref}
        />
      )}
    </>
  );
}
