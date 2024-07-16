import { create } from "zustand";
import { vizobj } from "@/classes/vizobj";
import { SliderControl } from "../classes/SliderControl";
import { Influence } from "../classes/influence";
import { influencesData, controlData, canvasData } from "@/classes/init_data_reg";

export type State = {
  vizobjs: { [id: number]: vizobj };
  controls: { [id: number]: SliderControl };
  influences: { [id: number]: Influence<any>[] }; // Changed to an array of influences
  setControlValue: (id: number) => (value: number) => void;
  setVizObj: (id: number, new_obj: vizobj) => void;
};

export const useStore = create<State>((set, get) => ({
  controls: controlData.reduce((acc, control) => {
    acc[control.id] = control;
    return acc;
  }, {} as { [id: number]: SliderControl }),

  influences: influencesData.reduce((acc, influence) => {
    if (!acc[influence.master_id]) {
      acc[influence.master_id] = [];
    }
    acc[influence.master_id].push(influence);
    return acc;
  }, {} as { [id: number]: Influence<any>[] }),

  vizobjs: canvasData.reduce((acc, obj) => {
    acc[obj.id] = obj;
    return acc;
  }, {} as { [id: number]: vizobj }),

  setVizObj: (id: number, new_obj: vizobj) => set((state) => {
    const updatedState = {
      vizobjs: { ...state.vizobjs, [id]: new_obj }
    };

    const influences = state.influences[id];
    if (influences) {
      influences.forEach(influence => {
        const master = new_obj;
        const worker = state.vizobjs[influence.worker_id];
        const value = influence.transformation(influence.get_attribute(master));
        updatedState.vizobjs[influence.worker_id] = influence.set_attribute(worker, value);
      });
    }

    return updatedState;
  }),

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

export const getObjectsSelector = (state: State) => Object.values(state.vizobjs);
export const setVizObjSelector = (state: State) => state.setVizObj;
export const setControlValueSelector = (control_id: number) => (state: State) => state.setControlValue(control_id);
export const getObjectSelector = (id: number) => (state: State) => state.vizobjs[id];
export const getControlSelector = (control_id: number) => (state: State) => state.controls[control_id];
export const getControlValueSelector = (control_id: number) => (state: State) => {
  const control = state.controls[control_id];
  const viz = state.vizobjs[control?.obj_id];
  return viz && control ? control.get_attribute(viz) : 0;
};
export const getInfluenceSelector = (master_id: number) => (state: State) => (master_id in state.influences ? state.influences[master_id] : []);
