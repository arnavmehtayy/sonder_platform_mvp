
import { create } from "zustand";
import { SliderControl } from "../classes/SliderControl";
import { Influence } from "../classes/influence";
import {
  influencesData,
  controlData,
  canvasData,
  scoreData,
} from "@/classes/init_data";

// import { initDataSets } from "@/classes/init_datasets";
import { initDataSets } from "@/classes/Data/CompleteData"
import { obj } from "@/classes/obj";
import { Control } from "@/classes/Control";
import { SelectControl } from "@/classes/SelectControl";
import { Score } from "@/classes/Score";
import { shallow } from "zustand/shallow";
import Validation_score from "@/classes/Validation_score";
import * as THREE from "three";
import { useMemo } from "react";
import Placement from "@/classes/Placement";
import Validation from "@/classes/Validation";
import Validation_test from "@/classes/Validation_test";
import Validation_obj from "@/classes/Validation_obj";
import { TransformObj } from "@/classes/transformObj";
import Validation_select from "@/classes/Validation_select";
import { MultiChoiceClass } from "@/classes/MultiChoiceClass";
import { ValidationMultiChoice } from "@/classes/ValidationMultiChoice";
import {InputNumber} from "@/classes/InputNumber";
import { Validation_inputNumber } from "@/classes/Validation_inputNumber";
import { EnablerControl } from "@/classes/EnablerControl";

export type State = {
  validations: Validation[];
  state_name: keyof typeof initDataSets;
  placement: Placement | null;
  vizobjs: { [id: number]: obj };
  controls: { [id: number]: Control };
  influences: { [id: number]: Influence<any, obj, obj>[] };
  scores: { [id: number]: Score<any> };
  setVizObj: (id: number, new_obj: obj) => void;
  setControlClick: (control_id: number, new_obj: Control) => void;
  reset: (dataSetKey: keyof typeof initDataSets) => void;
  deleteVizObj: (id: number) => boolean;
  updateInfluences: (id: number) => void;
  isSelectActive: boolean;
  isValidatorClickable: boolean;
  isPlacementMode: boolean;
  setSelectActive: (val: boolean) => void;
  updateValidations: () => void;
  updateAllInfluences: () => void;
  SetIsActiveControl: (control_id: number) => (val: boolean) => void;
  setIsPlacementMode: (val: boolean) => void;
  setMultiChoiceOptions: (control_id: number, Selectedoptions: number[]) => void;
  setInputNumberValue: (control_id: number, value: number | '') => void;
  setEnablerControl: (control_id: number) => (isEnabled: boolean) => void;
};

export const useStore = create<State>((set, get) => ({
  isPlacementMode: false,
  isValidatorClickable: true,
  validations: [],
  state_name: "default",
  controls: {},
  vizobjs: {},
  influences: {},
  scores: {},
  placement: null,
  isSelectActive: false,

  setEnablerControl: (control_id: number) => (isEnabled: boolean) => {
    const control = get().controls[control_id] as EnablerControl;
    // set obj_ids to enabled or disabled
    control.obj_ids.forEach((obj_id) => {
      const vobj = get().vizobjs[obj_id];
      if(vobj) {
      const updatedObj = obj.setEnableObject(vobj, isEnabled);
      get().setVizObj(obj_id, updatedObj);
      }
    })
    const newControl = control.setControlState(isEnabled);

  },
  setInputNumberValue: (control_id: number, value: number | '') => {
    set((state) => {
      const control = state.controls[control_id] as InputNumber;
      if (control instanceof InputNumber) {
        const updatedControl = control.setValue(value);

        return {controls: { ...state.controls, [control_id]: updatedControl }  }
      }
      return {}
    });
  },

  setMultiChoiceOptions: (control_id: number, Selectedoptions: number[]) => {
    set((state) => {
      const control = state.controls[control_id] as MultiChoiceClass;
      if (control instanceof MultiChoiceClass) {
        const updatedControl = control.setOptions(Selectedoptions);
        return { controls: { ...state.controls, [control_id]: updatedControl } };
      }
      return {};
    });
  },


  setIsPlacementMode: (val: boolean) => {
    set((state) => { 
      const updatedControls = Object.entries(state.controls).reduce((acc, [id, ctrl]) => {
        acc[Number(id)] = Control.setControlisClickable(ctrl, !val);
        return acc;
      }, {} as { [id: number]: Control });

      
      return {
        controls: updatedControls,
        isValidatorClickable: !val,
        isPlacementMode: val
      }});
  },

  SetIsActiveControl:
  (control_id: number) => (val: boolean) => {
    set((state) => {
    const control = state.controls[control_id] as SelectControl;
    if(control instanceof SelectControl) {
    
    // Update all controls, placement, and isValidatorClickable
    const updatedControls = Object.entries(state.controls).reduce((acc, [id, ctrl]) => {
      const isCurrentControl = Number(id) === control_id;
      acc[Number(id)] = isCurrentControl 
        ? (ctrl as SelectControl).setIsActive(val) 
        : Control.setControlisClickable(ctrl, !val);
      return acc;
    }, {} as { [id: number]: Control });

    const updatedPlacement = state.placement 
      ? Placement.setPlacementisClickable(state.placement, !val)
      : null;

    // Update selectable objects
    if(control) {
    control.selectable.forEach((obj_id) => {
      if (!control.selected.includes(obj_id)) {
        const updatedState = obj.setObjectisClickable(
          state.vizobjs[obj_id],
          val
        );
        state.setVizObj(obj_id, updatedState);
      }
    })
  }
    ;

    state.setSelectActive(val);
    const updatedState = control.setIsActive(val);
    state.setControlClick(control_id, updatedState);

    return {
      controls: updatedControls,
      placement: updatedPlacement,
      isValidatorClickable: !val
    }
  }
  else {
  return {}
  }

  })
},

  updateAllInfluences: () => {
    set((state) => {
      const updatedVizobjs = { ...state.vizobjs };

      Object.keys(state.influences).forEach((masterId) => {
        const masterObj = updatedVizobjs[Number(masterId)];
        const masterInfluences = state.influences[Number(masterId)];
        
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

  

  setSelectActive: (val: boolean) => {
    set({ isSelectActive: val });
  },

  updateValidations: () => {
    set((state) => {
      const updatedValidations = state.validations.map((validation) => {
        if (validation instanceof Validation_obj) {
          return validation.computeValidity(
            state.vizobjs[validation.obj_id] as TransformObj
          );
        } else if (validation instanceof Validation_select) {
          return validation.computeValidity(
            state.controls[validation.control_id] as SelectControl
          );
        } else if (validation instanceof Validation_score) {
          const objs: obj[] = state.scores[validation.score_id].obj_list.map((obj) => state.vizobjs[obj.id]);
          const value = state.scores[validation.score_id].computeValue(objs);
          return validation.computeValidity(value);
        } 
        else if(validation instanceof ValidationMultiChoice) {
          return validation.computeValidity(
            state.controls[validation.control_id] as MultiChoiceClass
          );
        }
        else if(validation instanceof Validation_inputNumber) {
          return validation.computeValidity(
            state.controls[validation.control_id] as InputNumber
          );
        }
        else {
          return validation.computeValidity(null);
        }
      });

      return { validations: updatedValidations };
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
      isValidatorClickable: true,
      state_name: dataSetKey,
      placement: dataSet.placement,
      isSelectActive: false,
      validations: dataSet.validations,

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
      }, {} as { [id: number]: Score<any> }),
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
  () => {
    Object.values(state.controls).forEach((control) => {
      if (control instanceof SelectControl) {
        const [updatedControl, wasSelected] = control.SelectObj(obj_id);
        if (wasSelected) {
          // Update the control state
          state.setControlClick(control.id, updatedControl);

          // Update the object's clickable state
          const new_obj = Object.assign(
            Object.create(Object.getPrototypeOf(state.vizobjs[obj_id])),
            state.vizobjs[obj_id]
          );
          new_obj.isClickable = false;
          state.setVizObj(obj_id, new_obj);

          // If capacity is reached, deactivate the control
          if (updatedControl.selected.length >= updatedControl.capacity) {
            const deactivatedControl = updatedControl.setIsActive(false);
            state.setControlClick(control.id, deactivatedControl);
            state.setSelectActive(false);

            // Make all unselected objects clickable again
            updatedControl.selectable.forEach((selectableId) => {
              if (!updatedControl.selected.includes(selectableId)) {
                const obj1 = state.vizobjs[selectableId];
                const updatedObj = obj.setObjectisClickable(obj1, true);
                state.setVizObj(selectableId, updatedObj);
              }
            });
          }
        }
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
    state.SetIsActiveControl(control_id)(val);
  };

// export const getScore = (score_id: number) => { // note score is not stored in the state
//     return scores[score_id];
// }



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
  state.updateValidations();
};

export const getValidationsSelector = (state: State) => state.validations;

export const UpdateAllInfluencesSelector = (state: State) => state.updateAllInfluences;

export const isPlacementModeSelector = (state: State) => state.isPlacementMode;

export const setIsPlacementModeSelector = (state: State) => (val: boolean) => {
  state.setIsPlacementMode(val);
}

export const setMultiChoiceOptionsSelector = (state: State) => (control_id: number, Selectedoptions: number[]) => {
  state.setMultiChoiceOptions(control_id, Selectedoptions);
}

export const setInputNumberValueSelector = (state: State) => (control_id: number, value: number | '') => {
  state.setInputNumberValue(control_id, value);
}

export const setEnablerControl = (control_id: number) => (state: State) => (isEnabled: boolean) => {
  state.setEnablerControl(control_id)(isEnabled);
  }
