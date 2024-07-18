import * as THREE from "three";
import { useStore, getObjectSelector, setVizObjSelector } from "@/app/store";
import { extend } from "@react-three/fiber";
import React, { memo, useRef, useState, useEffect } from "react";
import GeneralTransformControl from "./GeneralTransCont";
import { Line } from "@react-three/drei";
import { geomobj } from "@/classes/geomobj";
import { LineObj } from "@/classes/Lineobj";
import { TransformObj } from "@/classes/transformObj";
import { obj } from "@/classes/obj";
import { ShowGeomObj } from "./ShowgeomObj";
import { ShowLineObj } from "./ShowLineObj";

/*
  * This component handles the rendering of a single object in the scene.
  * It takes in an id and renders the object with that id.
  * If the object is not found, it logs an error to the console.
  * This component is used in the Experience component.
  * It uses memo to prevent unnecessary re-renders.


*/

export const Showobj = memo(({ id }: { id: number }) => {
  const obj = useStore(getObjectSelector(id));

  if (obj instanceof geomobj) {
    return <ShowGeomObj obj={obj} />;
  } else if (obj instanceof LineObj) {
    return <ShowLineObj obj={obj} />;
  } else {
    console.error(`Object with id ${id} not found`);
    return null;
  }
});
