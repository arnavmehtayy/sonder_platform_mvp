import { create } from "zustand";
import { SliderControl } from "../classes/SliderControl";
import { Influence } from "../classes/influence";
import {
  influencesData,
  controlData,
  canvasData,
} from "@/classes/init_data";
import { obj } from "@/classes/obj";
import { geomobj } from "@/classes/geomobj";
import { TransformObj } from "@/classes/transformObj";

export type State = {
  vizobjs: { [id: number]: obj };
  controls: { [id: number]: SliderControl<any> };
  influences: { [id: number]: Influence<any, any, any>[] }; // Changed to an array of influences
  setControlValue: (id: number) => (value: number) => void;
  setVizObj: (id: number, new_obj: obj) => void;
};

export const useStore = create<State>((set, get) => ({
  controls: controlData.reduce((acc, control) => {
    acc[control.id] = control;
    return acc;
  }, {} as { [id: number]: SliderControl<any> }),

  influences: influencesData.reduce((acc, influence) => {
    if (!acc[influence.master_id]) {
      acc[influence.master_id] = [];
    }
    acc[influence.master_id].push(influence);
    return acc;
  }, {} as { [id: number]: Influence<any,any, any>[] }),

  vizobjs: canvasData.reduce((acc, obj) => {
    acc[obj.id] = obj;
    return acc;
  }, {} as { [id: number]: obj }),

  setVizObj: (id: number, new_obj: obj) => {
    console.log(new_obj)
    set((state) => {
      const updatedState = {
        vizobjs: { ...state.vizobjs, [id]: new_obj },
      };

      const influences = state.influences[id];
      if (influences) {
        influences.forEach((influence) => {
          updatedState.vizobjs[influence.worker_id] = Influence.UpdateInfluence(
            influence,
            new_obj,
            state.vizobjs[influence.worker_id]
          );
        });
      }
    

      return updatedState;
    }) 
 // console.log("setVizObj", id, new_obj);
},

  setControlValue: (control_id: number) => (value: number) => {
    const state = get();
    const control = state.controls[control_id];
    if (control && state.vizobjs[control.obj_id]) {
      const obj_id = control.obj_id;
      const viz = state.vizobjs[obj_id];
      const updatedViz = control.set_attribute(viz, value);
      state.setVizObj(obj_id, updatedViz);
    }
  },
}));

export const getObjectsSelector = (state: State) =>
  Object.values(state.vizobjs);
export const setVizObjSelector = (state: State) => state.setVizObj;
export const setControlValueSelector = (control_id: number) => (state: State) =>
  state.setControlValue(control_id);
export const getObjectSelector = (id: number) => (state: State) =>
  state.vizobjs[id];
export const getControlSelector = (control_id: number) => (state: State) =>
  state.controls[control_id];
export const getControlValueSelector =
  (control_id: number) => (state: State) => {
    const control = state.controls[control_id];
    const viz = state.vizobjs[control?.obj_id];
    return viz && control ? control.get_attribute(viz) : 0;
  };
export const getInfluenceSelector = (master_id: number) => (state: State) =>
  master_id in state.influences ? state.influences[master_id] : [];
