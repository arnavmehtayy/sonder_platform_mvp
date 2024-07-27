import CoordinateAxis from "@/classes/CoordinateAxis";
import React, { useRef } from "react";
import * as THREE from "three";

export default function ShowAxis({obj}: {obj: CoordinateAxis}) {
    const object_ref = useRef<any>(null);
    return obj.getMesh({objectRef: object_ref, children: null, onClickSelect: (event: any) => {}})
    // the axis is not clickable
}