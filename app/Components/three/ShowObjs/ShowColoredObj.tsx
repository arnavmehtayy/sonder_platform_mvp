import * as THREE from "three";
import { useStore, getObjectSelector, setVizObjSelector } from "@/app/store";
import { extend } from "@react-three/fiber";
import React, { memo, useMemo } from "react";
import GeneralTransformControl from "../GeneralTransCont";
import { Line } from "@react-three/drei";
import { geomobj } from "@/classes/vizobjects/geomobj";
import { LineObj } from "@/classes/vizobjects/Lineobj";
import { TransformObj } from "@/classes/vizobjects/transformObj";
import { obj } from "@/classes/vizobjects/obj";
import { ShowGeomObj } from "./ShowgeomObj";
import { ShowLineObj } from "./ShowLineObj";
import ShowTextGeom from "./ShowTextGeom";
import textgeom from "@/classes/vizobjects/textgeomObj";
import CoordinateAxis from "@/classes/vizobjects/CoordinateAxis";
import ShowAxis from "./ShowAxis";
import coloredObj from "@/classes/vizobjects/coloredObj";

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
      mat.color.setHSL(0, 0, mat.color.getHSL({ h: 0, s: 0, l: 0 }).l * 0.1);
      mat.transparent = true;
      mat.opacity = 0.3;
    }

    return mat;
  }, [obj.color, selectionModeActive, obj.isClickable]);

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
