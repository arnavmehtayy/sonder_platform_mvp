import { LineObj } from "@/classes/Lineobj";
import { Line } from "@react-three/drei";
 

export function ShowLineObj({obj}: {obj: LineObj}) {
    return (
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}>
          <Line
            points={[
              [obj.start.x, obj.start.y, 0],
              [obj.end.x, obj.end.y, 0],
            ]} // Array of points, Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
            color={obj.color} // Default
            lineWidth={obj.line_width} // In pixels (default)
            segments // If true, renders a THREE.LineSegments2. Otherwise, renders a THREE.Line2
            dashed={false} // Default
            {...{ linebutt: "round", linecap: "round" }}
          />
        </mesh>
      );
}