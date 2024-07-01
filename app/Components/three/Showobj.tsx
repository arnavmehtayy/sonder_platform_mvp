import * as THREE from "three";
import { useStore, vizobjsSelector } from "@/app/store";
import { shallow } from "zustand/shallow";

/*
  * This component handles the rendering of a single object in the scene.
  * It takes in an id and renders the object with that id.
  * If the object is not found, it logs an error to the console.
  * This component is used in the Experience component.


*/

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
}


