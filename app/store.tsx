import { create } from "zustand";
import { vizobj } from "@/classes/vizobj";
import { SliderControl } from "../classes/SliderControl";
import { Influence } from "../classes/influence";
import { influencesData, controlData, canvasData } from "@/classes/init_data";

/*
 * This file is a store that uses zustand to manage the state of the application.
 * It provides the following selectors:
 * - getObjectsSelector: returns all the objects in the store
 * - setControlValueSelector: returns a function that sets the value of a control
 * - getObjectSelector: returns a function that gets an object by id
 * - getControlSelector: returns a function that gets a control by id
 * - getControlValueSelector: returns a function that gets the value of a control by id
 * - setVizObjSelector: returns a function that sets the value of a vizobj by id

 */

// Define the state type
type State = {
  vizobjs: vizobj[];
  controls: SliderControl[] | null;
  influences: Influence[] | null;
  setControlValue: (id: number, value: number) => void;
  setVizObj: (id: number, new_obj: vizobj) => void;
};

export const useStore = create<State>((set) => ({
  controls: controlData,

  influences: influencesData,

  vizobjs: canvasData,

  setVizObj: (id: number, new_obj: vizobj) => {set((state) => ({
    vizobjs: state.vizobjs.map((obj) => obj.id === id ? new_obj : obj)
  }))
},


  setControlValue: (control_id, value) =>
    set((state) => ({
      vizobjs: state.vizobjs.map((viz) => {
        const control = state.controls?.find(
          (ctrl) => ctrl.id === control_id && ctrl.obj_id === viz.id
        );

        return control ? control.set_attribute(viz, value) : viz;
      }),
    })),
}));

export const getObjectsSelector = (state: State) => state.vizobjs;

export const setVizObjSelector = (state: State) => state.setVizObj;

export const setControlValueSelector = (state: State) => state.setControlValue;

export const getObjectSelector = (id: number) => (state: State) =>
  state.vizobjs.find((obj) => obj.id === id);

export const getControlSelector = (state: State) => (control_id: number) =>
  state.controls?.find((obj) => obj.id === control_id);

export const getControlValueSelector =
  (state: State) => (control_id: number) => {
    const control = state.controls?.find((ctrl) => ctrl.id === control_id);
    const viz = state.vizobjs.find((obj) => obj.id === control?.obj_id);

    return viz && control ? control.get_attribute(viz) : 0;
  };
