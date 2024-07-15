// import { create } from "zustand";
// import { vizobj } from "@/classes/vizobj";
// import { SliderControl } from "../classes/SliderControl";
// import { Influence } from "../classes/influence";
// import { influencesData, controlData, canvasData } from "@/classes/init_data";

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
import { create } from "zustand";
import { vizobj } from "@/classes/vizobj";
import { SliderControl } from "../classes/SliderControl";
import { Influence } from "../classes/influence";
import { influencesData, controlData, canvasData } from "@/classes/init_data";

// Define the state type
export type State = {
  vizobjs: { [id: number]: vizobj };
  controls: { [id: number]: SliderControl };
  influences: { [id: number]: Influence<any> }; // the ID is the master_id 
  setControlValue: (id: number) => (value: number) => void;
  setVizObj: (id: number, new_obj: vizobj) => void;
};



// takes the list of SlideControls and stores them as a dict with the id as the key
export const useStore = create<State>((set) => ({ 
  controls: controlData.reduce((acc, control) => {
    acc[control.id] = control;
    return acc;
  }, {} as { [id: number]: SliderControl }),

  // influences: influencesData, // havent incooperated this yet
  // store as a dict with the master_id as the key
  influences: influencesData.reduce((acc, influence) => {
    acc[influence.master_id] = influence;
    return acc;
  }, {} as { [id: number]: Influence<any> }),

  // takes the list of vizobjs and stores them as a dict with the id as the key
  vizobjs: canvasData.reduce((acc, obj) => {
    acc[obj.id] = obj;
    return acc;
  }, {} as { [id: number]: vizobj }),

  setVizObj: (id: number, new_obj: vizobj) => set((state) =>  {
    return {
    vizobjs: { ...state.vizobjs, [id]: new_obj }
  }
}
)
,

  setControlValue: (control_id: number) => (value: number) => set((state) => {
  // Retrieve the control associated with the control_id
  const control = state.controls[control_id];

  // Check if the control exists and if there is a corresponding vizobj
  if (control && state.vizobjs[control.obj_id]) {
    const obj_id = control.obj_id;
    const viz = state.vizobjs[obj_id];
    // if(obj_id in state.influences){ // this is added
    //     Influence.UpdateInfluence(state.influences[obj_id], state.setVizObj, (id: number) => state.vizobjs[id]);
    // }
    // Update only the specific vizobj affected by the control change
    // state.setVizObj(obj_id, control.set_attribute(viz, value));
    return {
      vizobjs: {
        ...state.vizobjs,
        [obj_id]: control.set_attribute(viz, value) // note that set_attribute returns a function
      }
    };
  }

  return state; // Return the current state if no updates are required
}),
}));

export const getObjectsSelector = (state: State) => Object.values(state.vizobjs);
export const setVizObjSelector = (state: State) => state.setVizObj;
export const setControlValueSelector = (control_id: number) => (state: State) => state.setControlValue(control_id);
export const getObjectSelector = (id: number) => (state: State) => state.vizobjs[id];
export const getControlSelector = (control_id: number) => (state: State) => state.controls[control_id];
export const getControlValueSelector = (control_id: number) => (state: State) =>{
  const control = state.controls[control_id];
  const viz = state.vizobjs[control?.obj_id];
  return viz && control ? control.get_attribute(viz) : 0;
};
export const getInfluenceSelector = (master_id: number) => (state: State) => (master_id in state.influences? state.influences[master_id]: null)

// export const getVivObjAttributeSelector = (id: number, get_att: (obj: vizobj) => number) => (state: State) => {
//   const viz = state.vizobjs[id];

//   if(!viz) { // for debugging
//     console.log("vizobj not found in store");
//   }

//   return viz ? get_att(viz) : 0;
// }
