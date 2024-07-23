import textgeom from '@/classes/textgeom';
import { useRef } from 'react';
import { useStore, SelectObjectControl } from "@/app/store";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

export default function ShowTextGeom({obj}: {obj: textgeom}) {
    const object_ref = useRef<THREE.Mesh>(null);
    const add_obj = useStore(SelectObjectControl(obj.id));

    const onClickSelect = (event:  ThreeEvent<MouseEvent>) => {
        console.log("clicked")
        add_obj(); 
        event.stopPropagation();
      }


    return (
        
        obj.getMesh({ children: null, onClickSelect: onClickSelect, objectRef: object_ref})
        // <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}>
        //   <Line
        //     points={[
        //       [obj.start.x, obj.start.y, 0],
        //       [obj.end.x, obj.end.y, 0],
        //     ]} // Array of points, Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
        //     color={obj.color} // Default
        //     lineWidth={obj.line_width} // In pixels (default)
        //     segments // If true, renders a THREE.LineSegments2. Otherwise, renders a THREE.Line2
        //     dashed={false} // Default
        //     {...{ linebutt: "round", linecap: "round" }}
        //   />
        // </mesh>
      );
}   