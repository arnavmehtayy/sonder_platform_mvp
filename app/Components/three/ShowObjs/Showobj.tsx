import { useStore, getObjectSelector } from "@/app/store";
import React, { memo, useRef, useState, useEffect } from "react";
import coloredObj from "@/classes/vizobjects/coloredObj";
import { ShowColoredobj } from "./ShowColoredObj";

/*
  * This component handles the rendering of a single object in the scene.
  * It takes in an id and renders the object with that id.
  * It uses memo to prevent unnecessary re-renders.
*/

export const Showobj = memo(function Showobj({ id }: { id: number }) {
  const obj = useStore(getObjectSelector(id));
  if (obj instanceof coloredObj && obj.isEnabled) {
    return <ShowColoredobj obj={obj} />;
  } else {
    // console.error(`Object with id ${id} not found`);
    return null;
  }
});
