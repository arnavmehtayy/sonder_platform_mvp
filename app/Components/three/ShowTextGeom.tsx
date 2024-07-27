import textgeom from '@/classes/textgeom';
import { useRef, useMemo } from 'react';
import { useStore, SelectObjectControl } from "@/app/store";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

export default function ShowTextGeom({obj}: {obj: textgeom}) {
    const object_ref = useRef<THREE.Mesh>(null);
    const add_obj = useStore(SelectObjectControl(obj.id));
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

    const onClickSelect = (event:  ThreeEvent<MouseEvent>) => {
        add_obj(); 
        event.stopPropagation();
      }


    return (
        
        obj.getMesh({ children: null, onClickSelect: onClickSelect, objectRef: object_ref, material: material})
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