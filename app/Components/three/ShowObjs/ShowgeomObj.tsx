import React, { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import GeneralTransformControl from "../GeneralTransCont";
import { geomobj } from "@/classes/vizobjects/geomobj";
import { ThreeEvent } from "@react-three/fiber";
import { useStore, SelectObjectControl } from "@/app/store";


// This component is responsible for rendering a geomobj on the scene
// geometric objects can be controlled using the touch controls 


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

  useEffect(() => { // object can only be controlled if the object_ref is not null
    if (object_ref.current) {
      setControlsEnabled(true);
    }
  }, [object_ref.current]);

  const onClickSelect = (event: ThreeEvent<MouseEvent>) => {
    add_obj(); // when the object is clicked pass on this information to the store so that it can update the select controls
    event.stopPropagation();
  };


  // render each of the relevant Transforms for this geomobj
  return (
    <>

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
