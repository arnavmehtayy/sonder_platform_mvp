import * as THREE from "three";
import { useStore} from "@/app/store";
import React, { memo, useMemo } from "react";
import { geomobj } from "@/classes/vizobjects/geomobj";
import { LineObj } from "@/classes/vizobjects/Lineobj";

import { ShowGeomObj } from "./ShowgeomObj";
import { ShowLineObj } from "./ShowLineObj";
import ShowTextGeom from "./ShowTextGeom";
import textgeom from "@/classes/vizobjects/textgeomObj";
import CoordinateAxis from "@/classes/vizobjects/CoordinateAxis";
import ShowAxis from "./ShowAxis";
import coloredObj from "@/classes/vizobjects/coloredObj";


// memoized components so that they are not rerendered every frame.
// This component is responsible for rendering a colored object in the three js scene
// This also handles clicking this object and changing its color based on the selection mode (making it appear for selection and deselection)

export const ShowColoredobj = memo(function ShowColoredobj({
  obj,
}: {
  obj: coloredObj;
}) {
  const selectionModeActive = useStore((state) => state.isSelectActive);

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


  // show the object based on its type

  if (obj instanceof geomobj) {
    return <ShowGeomObj obj={obj} material={material} />;
  } else if (obj instanceof LineObj) {
    return <ShowLineObj obj={obj} material={material} />;
  } else if (obj instanceof textgeom) {
    return <ShowTextGeom obj={obj} material={material} />;
  } else if (obj instanceof CoordinateAxis) {
    return <ShowAxis obj={obj} material={material} />;
  } else {
    return null;
  }
});
