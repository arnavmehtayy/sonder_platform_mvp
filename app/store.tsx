import { create } from "zustand";
import { vizobj } from "@/classes/vizobj";
import * as THREE from "three";
import { Interactobj } from "@/classes/interactobj";

type State = {
  vizobjs: vizobj[];
  setVizobjpos: (id: number, x: number, y: number) => void;
  setVizobjscale: (id: number, scale: THREE.Vector3) => void;
  setVizobjrot: (id: number, rot: THREE.Vector3) => void;
  setInteractobjvalue: (id: number, value: number) => void;
};

let UserData: vizobj[] = [
  new vizobj(
    1,
    new THREE.Vector2(-10, 2),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 1, 1),
    new THREE.PlaneGeometry(4, 4),
    "green"
  ),
  new vizobj(
    2,
    new THREE.Vector2(2, 2),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(1, 1, 1),
    new THREE.PlaneGeometry(4, 4),
    "red",
    new Interactobj("rotate", [-4,4], 0)
  ),
];

export const useStore = create<State>((set) => ({
  vizobjs: UserData,

  setVizobjpos: (id, x, y) =>
    set((state) => ({
      vizobjs: state.vizobjs.map((obj) =>
        obj.id === id ? { ...obj, position: new THREE.Vector2(x, y) } : obj
      ),
    })),
  setVizobjscale: (id, scale) =>
    set((state) => ({
      vizobjs: state.vizobjs.map((obj) =>
        obj.id === id ? { ...obj, scale } : obj
      ),
    })),
  setVizobjrot: (id, rot) =>
    set((state) => ({
      vizobjs: state.vizobjs.map((obj) =>
        obj.id === id ? { ...obj, rotation: rot } : obj
      ),
    })),
  setInteractobjvalue: (id, value) =>
    set((state) => ({
      vizobjs: state.vizobjs.map((obj) => {
        if (obj.id === id && obj.control !== null) {
          switch (obj.control.action) {
            case "move":
              return { ...obj, position: new THREE.Vector2(value, obj.position.y), control: {...obj.control, value: value} }; // Assuming you want to change x and y by the same value
            case "rotate":
              return { ...obj, rotation: new THREE.Vector3(obj.rotation.x,obj.rotation.y,value), control: {...obj.control, value: value}  };
            case "scale":
              return { ...obj, scale: new THREE.Vector3(value,obj.scale.y,obj.scale.z), control: {...obj.control, value: value}  };
            default:
              return obj;
          }
        } else {
          return obj;
        }
      }),
    }))
}));

export const objectsSelector = (state: State) => state.vizobjs;
export const setVizobjposSelector = (state: State) => state.setVizobjpos;
export const setVizobjscaleSelector = (state: State) => state.setVizobjscale;
export const setVizobjrotSelector = (state: State) => state.setVizobjrot;
export const setInteractobjvalueSelector = (state: State) => state.setInteractobjvalue;
export const vizobjsSelector = (state: State) => (id: number) => state.vizobjs.filter((obj) => obj.id === id)[0];