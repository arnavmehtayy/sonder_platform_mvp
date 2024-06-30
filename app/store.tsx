import { create } from "zustand";
import { vizobj } from "@/classes/vizobj";
import * as THREE from "three";
import { Interactobj } from "@/classes/interactobj";

type State = {
  vizobjs: vizobj[];
  controls: Interactobj[] | null;
  setVizobjpos: (id: number, x: number, y: number) => void;
  setVizobjscale: (id: number, scale: THREE.Vector3) => void;
  setVizobjrot: (id: number, rot: THREE.Vector3) => void;
  setInteractobjvalue: (id: number, value: number) => void;
};

const controlData: Interactobj[] = [new Interactobj(1, 1, "rotate", [-4,4]),
new Interactobj(1, 1, "move", [-10,10])]


const canvasData: vizobj[] = [
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
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 1, 1),
    new THREE.PlaneGeometry(4, 4),
    "red"
  ),
];

export const useStore = create<State>((set) => ({
  controls: controlData,

  vizobjs: canvasData,

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
    setInteractobjvalue: (control_id, value) =>
      set((state) => ({
        vizobjs: state.vizobjs.map((viz) => {
          const control = state.controls?.find((ctrl) => ctrl.id === control_id && ctrl.obj_id === viz.id);
          
          if (control) {
            switch (control.action) {
              case "move":
                // Assuming you want to change x position, keep y the same
                return { ...viz, position: new THREE.Vector2(value, viz.position.y) };
              case "rotate":
                // Assuming you want to change the z-axis rotation only
                return { ...viz, rotation: new THREE.Vector3(viz.rotation.x, viz.rotation.y, value) };
              case "scale":
                // Assuming you want to change all axes uniformly
                return { ...viz, scale: new THREE.Vector3(value, value, value) };
              default:
                return viz;
            }
          } else {
            return viz;
          }
        }),
      })),
  }));

export const objectsSelector = (state: State) => state.vizobjs;
export const setVizobjposSelector = (state: State) => state.setVizobjpos;
export const setVizobjscaleSelector = (state: State) => state.setVizobjscale;
export const setVizobjrotSelector = (state: State) => state.setVizobjrot;
export const setInteractobjvalueSelector = (state: State) => state.setInteractobjvalue;
export const vizobjsSelector = (state: State) => (id: number) => state.vizobjs.find((obj) => obj.id === id);
export const controlsSelector = (state: State) => (control_id: number) => state.controls?.find((obj) => obj.obj_id === control_id);
export const InteraobjvalueSelector = (state: State) => (control_id: number) => {
  const control = state.controls?.find((ctrl) => ctrl.id === control_id);
  const viz = state.vizobjs.find((obj) => obj.id === control?.obj_id);
  if (viz && control) {
    switch (control.action) {
      case "move":
        return viz.position.x;
      case "rotate":
        return viz.rotation.z;
      case "scale":
        return viz.scale.x;
      default:
        return 0;
    }
  }
  return 0; // default
}