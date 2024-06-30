import * as THREE from "three";
import { useStore, vizobjsSelector } from "@/app/store";
import { shallow } from "zustand/shallow";

export function Showobj({ id }: { id: number }) {
  const objselector = useStore(vizobjsSelector);

  // Handle the no interaction case
  const obj = objselector(id);
  if(!obj){
    console.log("No object found for id: ", id)
  }
  
  return (
    obj ? 
    <mesh
      position={[obj.position.x, obj.position.y, 0]}
      rotation={[obj.rotation.x, obj.rotation.y, obj.rotation.z]}
      scale={[obj.scale.x, obj.scale.y, obj.scale.z]}
    >
      <primitive object={obj.geom} attach="geometry" />
      <meshBasicMaterial color={obj.color} />
    </mesh> : null
  );
  // return (
  //     <mesh position={[vizobjs[id-1].position.x, vizobjs[id-1].position.y, 0]}>
  //       <primitive object={vizobjs[id-1].geom} attach="geometry" />
  //       <meshBasicMaterial color={vizobjs[id-1].color} />
  //     </mesh>
  //   );
}
