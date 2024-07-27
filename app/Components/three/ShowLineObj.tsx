import { LineObj } from "@/classes/Lineobj";
import { Line } from "@react-three/drei";
import { ThreeEvent, useThree } from "@react-three/fiber";
import React, { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import {
    useStore,
    SelectObjectControl,
} from "@/app/store";

import { EffectComposer, Bloom } from '@react-three/postprocessing'

export function ShowLineObj({obj}: {obj: LineObj}) {
    const object_ref = useRef<THREE.Mesh>(null);
    const add_obj = useStore(SelectObjectControl(obj.id));
    const selectionModeActive = useStore((state) => state.isSelectActive);

    const material = useMemo(() => {
        const mat = new THREE.MeshBasicMaterial({
            color: obj.color,
            side: THREE.DoubleSide,
          });
    
        if (selectionModeActive && !obj.isClickable) {
          mat.color.setHSL(0, 0, mat.color.getHSL({ h: 0, s: 0, l: 0 }).l * 0.2);
        }
          return mat;
        }, [obj.color, obj.line_width, selectionModeActive, obj.isClickable]);

    const onClickSelect = (event: ThreeEvent<MouseEvent>) => {
        add_obj(); 
        event.stopPropagation();
    }

    return (
        <>
            {obj.getMesh({ 
                children: null, 
                onClickSelect: onClickSelect, 
                objectRef: object_ref,
                material: material,

            })}
            
        </>
    );
}