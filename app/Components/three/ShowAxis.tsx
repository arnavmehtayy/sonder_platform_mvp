import CoordinateAxis from "@/classes/CoordinateAxis";
import React, { useRef, useMemo} from "react";
import * as THREE from "three";
import { useStore } from "@/app/store"

export default function ShowAxis({obj}: {obj: CoordinateAxis}) {
    const object_ref = useRef<any>(null);
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


    return obj.getMesh({objectRef: object_ref, children: null, onClickSelect: (event: any) => {}, material: material})
    // the axis is not clickable
}