import { create } from "zustand";
import { vizobj } from "@/classes/vizobj";
import * as THREE from "three";
import { Interactobj } from "@/classes/interactobj";
import { step } from "three/examples/jsm/nodes/Nodes.js";
import { Influence } from "@/classes/influence";
import { influencesData, controlData, canvasData } from "@/classes/init_data";

type State = {
  vizobjs: vizobj[];
  controls: Interactobj[] | null;
  influences: Influence[] | null;
  setInteractobjvalue: (id: number, value: number) => void;
};


export const useStore = create<State>((set) => ({
  controls: controlData,

  influences: influencesData,

  vizobjs: canvasData,

  setInteractobjvalue: (control_id, value) =>
    set((state) => ({
      vizobjs: state.vizobjs.map((viz) => {
        const control = state.controls?.find(
          (ctrl) => ctrl.id === control_id && ctrl.obj_id === viz.id
        );

        if (control) {
          switch (control.action) {
            case "move":
              // Assuming you want to change x position, keep y the same
              return {
                ...viz,
                position: new THREE.Vector2(value, viz.position.y),
              };
            case "rotate":
              // Assuming you want to change the z-axis rotation only
              return {
                ...viz,
                rotation: new THREE.Vector3(
                  viz.rotation.x,
                  viz.rotation.y,
                  value
                ),
              };
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
export const setInteractobjvalueSelector = (state: State) =>
  state.setInteractobjvalue;
export const vizobjsSelector =  (id: number) => (state: State) =>
  state.vizobjs.find((obj) => obj.id === id);
export const controlsSelector = (state: State) => (control_id: number) =>
  state.controls?.find((obj) => obj.id === control_id);
export const InteraobjvalueSelector =
  (state: State) => (control_id: number) => {
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
  };
