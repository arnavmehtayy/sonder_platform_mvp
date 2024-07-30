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
import Validation_score from "@/classes/Validation_score";
import * as THREE from "three";

export type State = {
  validation: Validation;
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
  deleteVizObj: (id: number) => boolean;
  updateInfluences: (id: number) => void;
  isSelectActive: boolean;
  setSelectActive: (val: boolean) => void;
  updateValidation: () => void;
};

export const useStore = create<State>((set, get) => ({
  validation: new Validation_test(),
  state_name: null,
  question: "",
  controls: {},
  vizobjs: {},
  influences: {},
  scores: {},
  placement: null,
  isSelectActive: false,

  setSelectActive: (val: boolean) => {
    set({ isSelectActive: val });
  },

  updateValidation: () => {
    set((state) => {
      if (state.validation instanceof Validation_obj) {
        return {
          validation: state.validation.computeValidity(
            state.vizobjs[state.validation.obj_id] as TransformObj
          ),
        };
      } 
      else if(state.validation instanceof Validation_select) {
        return {
          validation: state.validation.computeValidity(
            state.controls[state.validation.control_id] as SelectControl
          ),
        };
      }
      else if(state.validation instanceof Validation_score) { // this condition badly coded and Im not proud of it 
        const objs: obj[] = state.scores[state.validation.score_id].obj_id_list.map((id) => state.vizobjs[id]);
        const value = state.scores[state.validation.score_id].computeValue(objs);
        return {
          validation: state.validation.computeValidity(
            value
          ),
        };
      }
      
      else {
        return {
          validation: state.validation.computeValidity(null),
        };
      }
    });
  },

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

  deleteVizObj: (id: number) => {
    if (id in get().vizobjs) {
      set((state) => {
        const updatedVizobjs = { ...state.vizobjs };
        delete updatedVizobjs[id];
        return { vizobjs: updatedVizobjs };
      });
      return true;
    }
    return false;
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
      isSelectActive: false,
      validation: dataSet.validation,

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

export const SelectObjectControl = // this

    (obj_id: number) =>
    (state: State) =>
    () => // may be too expensive redo if necessary
    {
      Object.values(state.controls).forEach((control) => {
        if (control instanceof SelectControl) {
          const select_obj = control.SelectObj(obj_id);
          const updatedState = select_obj[0];
          // new code
          if (select_obj[1]) {
            const new_obj = Object.assign(
              Object.create(Object.getPrototypeOf(state.vizobjs[obj_id])),
              state.vizobjs[obj_id]
            );
            new_obj.isClickable = false;
            state.setVizObj(obj_id, new_obj);
          }
          // new code
          state.setControlClick(control.id, updatedState);
        }
      });
    };

export const DeSelectObjectControl =
  (state: State) => (obj_id: number, control_id: number) => {
    // may be too expensive redo if necessary
    const control = state.controls[control_id] as SelectControl;
    if (obj_id in state.vizobjs) {
      const select_obj = control.deselectObj(obj_id);
      const updatedState = select_obj[0];
      if (select_obj[1]) {
        const new_obj = Object.assign(
          Object.create(Object.getPrototypeOf(state.vizobjs[obj_id])),
          state.vizobjs[obj_id]
        );
        new_obj.isClickable = true;
        state.setVizObj(obj_id, new_obj);
      }
      state.setControlClick(control.id, updatedState); // updates the state of the control with the added object
    }
  };

export const SetIsActiveControl =
  (control_id: number) => (state: State) => (val: boolean) => {
    const control = state.controls[control_id] as SelectControl;
    control.selectable.forEach((obj_id) => {
      if (!control.selected.includes(obj_id)) {
        const updatedState = obj.setObjectisClickable(
          state.vizobjs[obj_id],
          val
        );
        state.setVizObj(obj_id, updatedState);
      }
    });
    const updatedState = control.setIsActive(val);
    state.setControlClick(control_id, updatedState);
    state.setSelectActive(val);
  };

// export const getScore = (score_id: number) => { // note score is not stored in the state
//     return scores[score_id];
// }

import { useMemo } from "react";
import Placement from "@/classes/Placement";
import Validation from "@/classes/Validation";
import Validation_test from "@/classes/Validation_test";
import Validation_obj from "@/classes/Validation_obj";
import { TransformObj } from "@/classes/transformObj";
import Validation_select from "@/classes/Validation_select";

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

export const UpdateInfluenceSelector =
  (master_id: number) => (state: State) => {
    state.updateInfluences(master_id);
  };

export const DeleteVizObjSelector = (state: State) => (id: number) => {
  return state.deleteVizObj(id);
};

export const UpdateValidationSelector = (state: State) => () => {
  state.updateValidation();
};
