import { LineObj } from "@/classes/Lineobj";
import { Line } from "@react-three/drei";
import { ThreeEvent, useThree } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import {
    useStore,
    SelectObjectControl,
} from "@/app/store";

import { EffectComposer, Bloom } from '@react-three/postprocessing'

export function ShowLineObj({obj}: {obj: LineObj}) {
    const object_ref = useRef<THREE.Mesh>(null);
    const add_obj = useStore(SelectObjectControl(obj.id));

    const onClickSelect = (event: ThreeEvent<MouseEvent>) => {
        console.log("clicked")
        add_obj(); 
        event.stopPropagation();
    }

    return (
        <>
            {obj.getMesh({ 
                children: null, 
                onClickSelect: onClickSelect, 
                objectRef: object_ref,

            })}
            
        </>
    );
}