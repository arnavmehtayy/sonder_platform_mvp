import * as THREE from "three";
import { useStore, vizobjsSelector} from "@/app/store"

export function Showobj({ id }: { id: number }) {
  const objselector = useStore(vizobjsSelector);

    // Handle the no interaction case
    if(objselector(id).control === null) {
        console.log("update green")
    }
    return (
      <mesh position={[objselector(id).position.x, objselector(id).position.y, 0]}>
        <primitive object={objselector(id).geom} attach="geometry" />
        <meshBasicMaterial color={objselector(id).color} />
      </mesh>
    );
    // return (
    //     <mesh position={[vizobjs[id-1].position.x, vizobjs[id-1].position.y, 0]}>
    //       <primitive object={vizobjs[id-1].geom} attach="geometry" />
    //       <meshBasicMaterial color={vizobjs[id-1].color} />
    //     </mesh>
    //   );

  
}
