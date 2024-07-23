import { create } from "zustand";
import { SliderControl } from "../classes/SliderControl";
import { Influence } from "../classes/influence";
import {
  influencesData,
  controlData,
  canvasData,
  scoreData,
} from "@/classes/init_data";

import { initDataSets } from "@/classes/init_datasets";
import { obj } from "@/classes/obj";
import { Control } from "@/classes/Control";
import { SelectControl } from "@/classes/SelectControl";
import { Score } from "@/classes/Score";
import { shallow } from "zustand/shallow";

export type State = {
  state_name: keyof typeof initDataSets | null;
  question: string;
  placement: Placement | null;
  vizobjs: { [id: number]: obj };
  controls: { [id: number]: Control };
  influences: { [id: number]: Influence<any, obj, obj>[] };
  scores: { [id: number]: Score<any, any> };
  setVizObj: (id: number, new_obj: obj) => void;
  setControlClick: (control_id: number, new_obj: Control) => void;
  reset: (dataSetKey: keyof typeof initDataSets) => void;
  updateInfluences: (id: number) => void;
};

export const useStore = create<State>((set, get) => ({
  state_name: null,
  question: "",
  controls: {},
  vizobjs: {},
  influences: {},
  scores: {},
  placement: null,

  setVizObj: (id: number, new_obj: obj) => {
    set((state) => {
      const updatedState = {
        vizobjs: { ...state.vizobjs, [id]: new_obj },
      };

      const masterInfluences = state.influences[id];
      if (masterInfluences) {
        masterInfluences.forEach((influence: Influence<any, any, any>) => {
          updatedState.vizobjs[influence.worker_id] = Influence.UpdateInfluence(
            influence,
            new_obj,
            state.vizobjs[influence.worker_id]
          );
        });
      }

      return updatedState;
    });
  },

  setControlClick: (control_id: number, new_obj: Control) => {
    set((state) => {
      return { controls: { ...state.controls, [control_id]: new_obj } };
    });
  },

  reset: (dataSetKey: keyof typeof initDataSets) => {

    const dataSet = initDataSets[dataSetKey];
    set({

      question: dataSet.question,
      state_name: dataSetKey,
      placement: dataSet.placement,


      controls: dataSet.controlData.reduce((acc, control) => {
        acc[control.id] = control;
        return acc;
      }, {} as { [id: number]: Control }),

      vizobjs: dataSet.canvasData.reduce((acc, obj) => {
        acc[obj.id] = obj;
        return acc;
      }, {} as { [id: number]: obj }),

      influences: dataSet.influencesData.reduce((acc, influence) => {
        if (!acc[influence.master_id]) {
          acc[influence.master_id] = [];
        }
        acc[influence.master_id].push(influence);
        return acc;
      }, {} as { [id: number]: Influence<any, obj, obj>[] }),

      scores: dataSet.scoreData.reduce((acc, score) => {
        acc[score.score_id] = score;
        return acc;
      }, {} as { [id: number]: Score<any, any> }),
    });

    set((state) => {
      const updatedVizobjs = { ...state.vizobjs };

      Object.keys(updatedVizobjs).forEach((objId) => {
        const masterObj = updatedVizobjs[Number(objId)];
        const masterInfluences = state.influences[Number(objId)];
        if (masterInfluences) {
          masterInfluences.forEach((influence) => {
            updatedVizobjs[influence.worker_id] = Influence.UpdateInfluence(
              influence,
              masterObj,
              updatedVizobjs[influence.worker_id]
            );
          });
        }
      });

      return { vizobjs: updatedVizobjs };
    });
  },
  updateInfluences: (id: number) => {
    set((state) => {
      const updatedVizobjs = { ...state.vizobjs };
      const masterObj = updatedVizobjs[id];
      const masterInfluences = state.influences[id];

      if (masterInfluences) {
        masterInfluences.forEach((influence) => {
          updatedVizobjs[influence.worker_id] = Influence.UpdateInfluence(
            influence,
            masterObj,
            updatedVizobjs[influence.worker_id]
          );
        });
      }

      return { vizobjs: updatedVizobjs };
    });
  },
}));

// Update getScore to use the state
export const getScore = (score_id: number) => {
  const scores = useStore.getState().scores;
  return scores[score_id];
};

export const getObjectsSelector = (state: State) =>
  Object.values(state.vizobjs);
export const setVizObjSelector = (state: State) => state.setVizObj;
export const setControlValueSelector =
  (control_id: number) => (state: State) => (value: number) => {
    const control = state.controls[control_id] as SliderControl<any>;
    if (control && state.vizobjs[control.obj_id]) {
      const obj_id = control.obj_id;
      const viz = state.vizobjs[obj_id];
      // use the set_attribute to update the viz
      const updatedViz = control.set_attribute(viz, value);
      state.setVizObj(obj_id, updatedViz);
    }
  };
export const getObjectSelector = (id: number) => (state: State) =>
  state.vizobjs[id];

export const getObjectSelector2 = (state: State) => (id: number) =>
  state.vizobjs[id];

export const getControlSelector = (control_id: number) => (state: State) =>
  state.controls[control_id];
export const getControlValueSelector =
  (control_id: number) => (state: State) => {
    const control = state.controls[control_id] as SliderControl<any>;
    const viz = state.vizobjs[control?.obj_id];
    return viz && control ? control.get_attribute(viz) : 0;
  };

export const SelectObjectControl =
  (obj_id: number) =>
  (state: State) =>
  () => // may be too expensive redo if necessary
  {
    Object.values(state.controls).forEach((control) => {
      if (control instanceof SelectControl) {
        const updatedState = control.SelectObj(obj_id);
        state.setControlClick(control.id, updatedState);
      }
    });
  };

export const DeSelectObjectControl =
  (state: State) => (obj_id: number, control_id: number) => {
    // may be too expensive redo if necessary
    const control = state.controls[control_id] as SelectControl;
    if (obj_id in state.vizobjs) {
      const updatedState = control.deselectObj(obj_id);
      state.setControlClick(control.id, updatedState); // updates the state of the control with the added object
    }
  };

export const SetIsActiveControl =
  (control_id: number) => (state: State) => (val: boolean) => {
    const control = state.controls[control_id] as SelectControl;
    const updatedState = control.setIsActive(val);
    state.setControlClick(control_id, updatedState);
  };

// export const getScore = (score_id: number) => { // note score is not stored in the state
//     return scores[score_id];
// }

import { useMemo } from "react";
import Placement from "@/classes/Placement";

export const useObjectSelector = (id: number) => {
  const selector = useMemo(() => getObjectSelector(id), [id]);
  return useStore(selector, shallow);
};

export const useControlSelector = (control_id: number) => {
  const selector = useMemo(() => getControlSelector(control_id), [control_id]);
  return useStore(selector, shallow);
};

export const useControlValueSelector = (control_id: number) => {
  const selector = useMemo(
    () => getControlValueSelector(control_id),
    [control_id]
  );
  return useStore(selector);
};

export const getQuestionSelector = (state: State) => state.question;

export const getNameSelector = (state: State) => (id: number) =>
  state.vizobjs[id].name;

export const getStateName = (state: State) => state.state_name;

export const getPlacementSelector = (state: State) => state.placement;

export const UpdateInfluenceSelector = (master_id: number) => (state: State) => {
  state.updateInfluences(master_id);
}
