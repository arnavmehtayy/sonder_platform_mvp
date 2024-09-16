import { create } from "zustand";
import { SliderControl } from "../classes/Controls/SliderControl";
import { Influence } from "../classes/influence";

// import { initDataSets } from "@/classes/init_datasets";
import { initDataSets } from "@/classes/Data/CompleteData";
import { obj } from "@/classes/vizobjects/obj";
import { Control } from "@/classes/Controls/Control";
import { SelectControl } from "@/classes/Controls/SelectControl";
import { Score } from "@/classes/Scores/Score";
import Validation_score from "@/classes/Validation/Validation_score";

import Placement from "@/classes/Placement";
import Validation from "@/classes/Validation/Validation";
import Validation_obj from "@/classes/Validation/Validation_obj";
import { TransformObj } from "@/classes/vizobjects/transformObj";
import Validation_select from "@/classes/Validation/Validation_select";
import { MultiChoiceClass } from "@/classes/Controls/MultiChoiceClass";
import { ValidationMultiChoice } from "@/classes/Validation/ValidationMultiChoice";
import { InputNumber } from "@/classes/Controls/InputNumber";
import { Validation_inputNumber } from "@/classes/Validation/Validation_inputNumber";
import { EnablerControl } from "@/classes/Controls/EnablerControl";
import { Option } from "@/classes/Controls/MultiChoiceClass";
import { Question } from "@/classes/Question";

/*

A state in our storage system represents a single visual slide in our viztools. 

Data in our Storage System:
state_name: A unique name that is given to each visual interactive slide
Vizobjs: a dictionary of id => instance that represent objects on the three.js canvas
Controls: a dictionary of id => instance that represents any control in our sidebar
Placements: a single instance that represents a placement control allowing users to place objects on the three.js canvas. Could be null
Validations: a dictionary of id => instance that represents the ‘correct’ states for each of the controls and objects that is used to validate if the user has answered all the questions correctly.
Influences:  a dictionary of id => instance that defines how a particular viz obj may affect another vizobj. There are two objects the master: the master which is the object that is influencing and the worker which is the object that is being influenced. Allows the worker object to listen to a particular attribute of the master object and change its own attributes based on the master's attributes. 
Scores: a dictionary of id => instance that represents the numerical scores that are displayed in the sidebar that can change when controls are adjusted by the user.
isSelectActive: stores if the select control has been activated so that we can disable other interactions 
isActivePlacement: stores if the placement control has been activated so that we can disable other interactions 
questions: a dictionary of id => string that stores the questions that are displayed in the sidebar

Functions in our Storage System:

SetEnablerControl: The enabler control enables/disables viz objects on the screen. This function can be used to set the boolean value of any particular Enabler. (Note an enabler is a control)
SetInputNumberValue: The InputNumber control allows users to input numbers. This function is used to update the number when a changes the input.
SetMultiChoiceOptions: The MultiChoiceOptions control manages multiple choice questions. This function is used to update the options that are selected by the user.
SetIsPlacementMode: set if placement has been activated/deactivated, and updates the clickability of each control accordingly.
SetIsActiveSelectControl: set the particular select control to be active and disable every other control, and also disable the placement if it exists. Further this function deals with the logic of selection, it sets the relevant objects to be clickable and it sets the button to inactive when all the selections have been made.
updateAllInfluences: when this function is called each of the influences in the influences dictionary is updated. That is the worker, and the master assigned in the influences are synced as per the influence defined.
setSelectActive: the isSelectActive object stores if any select is active. This function can be used to change this boolean variable.
updateValidations: This function handles the updation of the states of the Validation objects. These objects store the answers for the interactions that the user has executed, and compare the user's state with the answer.
setVizObj: used to set a particular viz object. Note that after a viz object is set we also update the influences for which the particular viz object was the worker.
deleteVizObj: Deletes a viz object from the vizobjs list
setControl: given the id and a new control object resets the object in the controls list.
Reset: takes in the state_name and populates the placement, scores, vizobjs, controls, validations, influences, and then updates all the viz objects according to the influences. Note that all this data comes from initDataSet in the CompleteData.tsx file. This file is manually populated

*/

export class OrderItem {
  type: SideBarComponentType;
  id: number;

  constructor(type: SideBarComponentType, id: number) {
    this.type = type;
    this.id = id;
  }
  // hint?: string; removed hints for now will move it somewhere else
}

export type SideBarComponentType = "score" | "control" | "placement" | "question"; // possible types of objects that can be in the sidebar

export type EditAddType = Question | obj | Control  | Score<any> | Placement | Influence<any, obj, obj> | Validation;

export type State = {
  title: string;
  questions: { [id: number]: string };
  order: OrderItem[];
  validations: Validation[];
  state_name: keyof typeof initDataSets;
  placement: { [id: number]: Placement };
  vizobjs: { [id: number]: obj };
  controls: { [id: number]: Control };
  influences: { [id: number]: Influence<any, obj, obj>[] };
  scores: { [id: number]: Score<any> };
  setVizObj: (id: number, new_obj: obj) => void;
  setControl: (control_id: number, new_obj: Control) => void;
  reset: (dataSetKey: keyof typeof initDataSets) => void;
  deleteVizObj: (id: number) => boolean;
  isSelectActive: boolean;
  isActivePlacement: boolean;
  setSelectActive: (val: boolean) => void;
  updateValidations: () => void;
  updateAllInfluences: () => void;
  SetIsActiveSelectControl: (control_id: number) => (val: boolean) => void;
  setIsPlacementMode: (val: boolean) => void;
  setMultiChoiceOptions: (
    control_id: number,
    Selectedoptions: number[]
  ) => void;
  setInputNumberValue: (control_id: number) => (value: number | "") => void;
  setEnablerControl: (control_id: number) => (isEnabled: boolean) => void;
  addQuestion: (id: number, text: string) => void;
  addMCQuestion: (id: number, title: string, desc: string, options: Option[]) => void;
  addElement: (element: EditAddType) => void;
  setIsPlacementModeIndividual:  (id: number, val: boolean) => void
  setNumObjectsPlaced: (id: number, num: number) => void

};

export const useStore = create<State>((set, get) => ({
  title: "",
  questions: {},
  order: [],
  isActivePlacement: false,
  validations: [],
  state_name: "default",
  controls: {},
  vizobjs: {},
  influences: {},
  scores: {},
  placement: [],
  isSelectActive: false,

  setNumObjectsPlaced: (id: number, num: number) => {
    set((state) => {
      let updatedState: Partial<State> = {}
      const placement = state.placement[id];
    const updatedPlacement = Placement.setNumObjectsPlaced(placement, num);
    updatedState = {
      placement: { ...state.placement, [id]: updatedPlacement },
    };
    return updatedState
    })
  },

  setIsPlacementModeIndividual: (id: number, val: boolean) => {
    set((state) => {
      let updatedState:  Partial<State> = {};
    if(val) {
      state.setIsPlacementMode(true);
    }
    else {
      state.setIsPlacementMode(false);
    }
    const placement = state.placement[id];
    const updatedPlacement = Placement.setPlacementActive(placement, val);
    updatedState = {
      placement: { ...state.placement, [id]: updatedPlacement },
    };
    return updatedState
  })
  },

  // add any element to the state (vizobj, control, score, placement, influence, validation, order)
  // this is used by the editting system.
  addElement: (element: EditAddType) => {
    console.log(element);
    set((state) => {
      let updatedState: Partial<State> = {};


      if (element instanceof obj) {
        updatedState = {
          vizobjs: { ...state.vizobjs, [element.id]: element },
        };
      } else if (element instanceof Question) {
        updatedState = {
          questions: { ...state.questions, [element.id]: element.question },
          order: [...state.order, { type: "question", id: element.id }],
        };
      } else if (element instanceof Control) {
        updatedState = {
          controls: { ...state.controls, [element.id]: element },
          order: [...state.order, { type: "control", id: element.id }],
        };
      } else if (element instanceof Score) {
        updatedState = {
          scores: { ...state.scores, [element.score_id]: element },
          order: [...state.order, { type: "score", id: element.score_id }],
        };
      } else if (element instanceof Placement) {
        updatedState = {
          placement: { ...state.placement, [element.id]: element },
          order: [...state.order, { type: "placement", id: element.id}], // currently only one placement allowed
        };
      } else if (element instanceof Influence) {
        if (!state.influences[element.master_id]) {
          state.influences[element.master_id] = [];
        }
        state.influences[element.master_id].push(element);
        updatedState = {
          influences: state.influences,
        };
      } else if (element instanceof Validation) {
        updatedState = {
          validations: [...state.validations, element],
        };
      }

      return updatedState;
    });
  },

  addMCQuestion: (id: number, title: string, desc: string, options: Option[]) => {
    set((state) => {
      const updatedControl= { ...state.controls, [id]:  new MultiChoiceClass(
        {
          id: id,
          title: title,
          description: desc,
          options: options,
        })
      };
      const updatedOrder: OrderItem[] = [
        ...state.order,
        { type: "control", id: id },
      ];

      return {
        controls: updatedControl,
        order: updatedOrder,
      };
    });
  },

  addQuestion: (id: number, text: string) => {
    set((state) => {
      const updatedQuestions = { ...state.questions, [id]: text };
      const updatedOrder: OrderItem[] = [
        ...state.order,
        { type: "question" as const, id },
      ];

      return {
        questions: updatedQuestions,
        order: updatedOrder,
      };
    });
  },

  // The enabler control enables/disables viz objects on the screen. This function can be used to set the boolean value of any particular Enabler. (Note an enabler is a control)
  setEnablerControl: (control_id: number) => (isEnabled: boolean) => {
    const control = get().controls[control_id] as EnablerControl;
    // set obj_ids to enabled or disabled
    control.obj_ids.forEach((obj_id) => {
      const vobj = get().vizobjs[obj_id];
      if (vobj) {
        const updatedObj = obj.setEnableObject(vobj, isEnabled);
        get().setVizObj(obj_id, updatedObj);
      }
    });
    const newControl = control.setControlState(isEnabled);
  },

  // The InputNumber control allows users to input numbers. This function is used to update the number when a changes the input.
  setInputNumberValue: (control_id: number) => (value: number | "") => {
    set((state) => {
      const control = state.controls[control_id] as InputNumber;
      if (control instanceof InputNumber) {
        const updatedControl = control.setValue(value);

        return {
          controls: { ...state.controls, [control_id]: updatedControl },
        };
      }
      return {};
    });
  },

  // The MultiChoiceOptions control manages multiple choice questions. This function is used to update the options that are selected by the user.
  setMultiChoiceOptions: (control_id: number, Selectedoptions: number[]) => {
    set((state) => {
      const control = state.controls[control_id] as MultiChoiceClass;
      if (control instanceof MultiChoiceClass) {
        const updatedControl = control.setOptions(Selectedoptions);
        return {
          controls: { ...state.controls, [control_id]: updatedControl },
        };
      }
      return {};
    });
  },

  // set if placement has been activated/deactivated, and updates the clickability of each control accordingly.
  setIsPlacementMode: (val: boolean) => {
    set((state) => {
      const updatedControls = Object.entries(state.controls).reduce(
        (acc, [id, ctrl]) => {
          acc[Number(id)] = Control.setControlisClickable(ctrl, !val);
          return acc;
        },
        {} as { [id: number]: Control }
      );

      return {
        controls: updatedControls,
        isActivePlacement: val,
      };
    });
  },

  // set the particular select control to be active and disable every other control, and also disable the placement if it exists. Further this function deals with the logic of selection, it sets the relevant objects to be clickable and it sets the button to inactive when all the selections have been made.
  SetIsActiveSelectControl: (control_id: number) => (val: boolean) => {
    set((state) => {
      const control = state.controls[control_id] as SelectControl;
      if (control instanceof SelectControl) {
        // set the current control to be active and disable all other controls
        const updatedControls = Object.entries(state.controls).reduce(
          (acc, [id, ctrl]) => {
            const isCurrentControl = Number(id) === control_id;
            acc[Number(id)] = isCurrentControl
              ? (ctrl as SelectControl).setIsActive(val)
              : Control.setControlisClickable(ctrl, !val);
            return acc;
          },
          {} as { [id: number]: Control }
        );

        const updatedPlacement = Object.entries(state.placement).reduce((acc, [id, placement]) => {
              acc[placement.id] = Placement.setPlacementisClickable(placement, !val);
              return acc;
            }, {} as { [id: number]: Placement })
          

        // Update selectable objects and make sure they are clickable
        if (control) {
          control.selectable.forEach((obj_id) => {
            if (!control.selected.includes(obj_id)) {
              const updatedState = obj.setObjectisClickable(
                state.vizobjs[obj_id],
                val
              );
              state.setVizObj(obj_id, updatedState);
            }
          });
        }
        state.setSelectActive(val);
        const updatedState = control.setIsActive(val);
        state.setControl(control_id, updatedState);

        return {
          controls: updatedControls,
          placement: updatedPlacement,
        };
      } else {
        return {};
      }
    });
  },

  // when this function is called each of the influences in the influences dictionary is updated. That is the worker, and the master assigned in the influences are synced as per the influence defined.
  updateAllInfluences: () => {
    set((state) => {
      const updatedVizobjs = { ...state.vizobjs };

      Object.keys(state.influences).forEach((masterId) => {
        const masterObj = updatedVizobjs[Number(masterId)]; // get the master object
        const masterInfluences = state.influences[Number(masterId)]; // get the influence object

        if (masterInfluences) {
          masterInfluences.forEach((influence) => {
            updatedVizobjs[influence.worker_id] = Influence.UpdateInfluence(
              influence,
              masterObj,
              updatedVizobjs[influence.worker_id]
            ); // update each of the influences that the masterInfluences controls
          });
        }
      });

      return { vizobjs: updatedVizobjs };
    });
  },

  // set if select has been activated/deactivated
  setSelectActive: (val: boolean) => {
    set({ isSelectActive: val });
  },

  // This function handles the updation of the states of the Validation objects. These objects store the answers for the interactions that the user has executed, and compare the user's state with the answer.
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
          const objs: obj[] = state.scores[validation.score_id].obj_list.map(
            (obj) => state.vizobjs[obj.id]
          );
          const value = state.scores[validation.score_id].computeValue(objs);
          return validation.computeValidity(value);
        } else if (validation instanceof ValidationMultiChoice) {
          return validation.computeValidity(
            state.controls[validation.control_id] as MultiChoiceClass
          );
        } else if (validation instanceof Validation_inputNumber) {
          return validation.computeValidity(
            state.controls[validation.control_id] as InputNumber
          );
        } else {
          return validation.computeValidity(null);
        }
      });

      return { validations: updatedValidations };
    });
  },

  // used to set a particular viz object. Note that after a viz object is set we also update the influences for which the particular viz object was the worker.
  setVizObj: (id: number, new_obj: obj) => {
    set((state) => {
      const updatedState = {
        vizobjs: { ...state.vizobjs, [id]: new_obj },
      };

      // update the influences for which the added object is a master
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

  // Deletes a viz object from the vizobjs list

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

  // given the id and a new control object resets the object in the controls list.
  setControl: (control_id: number, new_obj: Control) => {
    set((state) => {
      return { controls: { ...state.controls, [control_id]: new_obj } };
    });
  },

  // takes in the state_name and populates the placement, scores, vizobjs, controls, validations, influences, and then updates all the viz objects according to the influences. Note that all this data comes from initDataSet in the CompleteData.tsx file. This file is manually populated
  reset: (dataSetKey: keyof typeof initDataSets) => {
    const dataSet = initDataSets[dataSetKey];
    set({
      title: dataSet.title,
      state_name: dataSetKey,
      order: dataSet.order,
      isSelectActive: false,
      validations: dataSet.validations,

      placement: dataSet.placement.reduce((acc, placement) => {
        acc[placement.id] = placement;
        return acc;
      }
      , {} as { [id: number]: Placement }),

      questions: dataSet.questions.reduce((acc, question) => {
        acc[question.id] = question.text;
        return acc;
      }, {} as { [id: number]: string }),

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
}));

// get the score corresponding to some score_id
export const getScore = (score_id: number) => {
  const scores = useStore.getState().scores;
  return scores[score_id];
};

// get the list of all vizobjects
export const getObjectsSelector = (state: State) =>
  Object.values(state.vizobjs);

// get the function to set an arbitrary vizobject
export const setVizObjSelector = (state: State) => state.setVizObj;

// get the function to set a particular vizobject defined by its id
// this is a curried function that takes the id of the object to be set first
// to call it do useStore(setVizObjSelector2(id))(new_obj) this helps with effeciency
export const setVizObjSelector2 =
  (id: number) => (state: State) => (new_obj: obj) => {
    state.setVizObj(id, new_obj);
  };

// get the function to set the value of a particular slider control
// this is a curried function that takes the id of the control to be set first
export const setSliderControlValueSelector =
  (control_id: number) => (state: State) => (value: number) => {
    const control = state.controls[control_id] as SliderControl<any>;
    if (control && state.vizobjs[control.obj_id]) {
      const obj_id = control.obj_id;
      const viz = state.vizobjs[obj_id];
      // use the set_attribute to update the viz
      const updatedViz = control.setSliderValue(viz, value);
      state.setVizObj(obj_id, updatedViz);
    }
  };

// get the vizobj corresponding to a particular id
// this is a curried function that takes the id of the vizobj to be set first
export const getObjectSelector = (id: number) => (state: State) => 
  state.vizobjs[id];

// get the vizobj corresponding to an arbitrary id
export const getObjectSelector2 = (state: State) => (id: number) =>
  state.vizobjs[id];

export const getControlSelector = (control_id: number) => (state: State) =>
  state.controls[control_id];

export const getControlSelector2 = (state: State) => (control_id: number) => 
  state.controls[control_id];

// get the value of a particular slider control given its id
export const getSliderControlValueSelector =
  (control_id: number) => (state: State) => {
    const control = state.controls[control_id] as SliderControl<any>;
    const viz = state.vizobjs[control?.obj_id]; // get the vizobject corresponding to the slider control
    return viz && control.getSliderValue(viz);

    // NOTE: 0 is the default value if the vizobject or control is not found
  };

// updates the state of all of the Select Controls given the id of a vizobject that has been clicked
export const SelectObjectControl = (obj_id: number) => (state: State) => () => {
  Object.values(state.controls).forEach((control) => {
    if (control instanceof SelectControl) {
      // wasSelected is true if the objected was actually added to the selected list
      const [updatedControl, wasSelected] = control.SelectObj(obj_id);

      if (wasSelected) {
        // Update the control with the new SelectControl obj that has the selected object added
        state.setControl(control.id, updatedControl);

        // make the object that just just been clicked unclickable
        const new_obj = Object.assign(
          Object.create(Object.getPrototypeOf(state.vizobjs[obj_id])),
          state.vizobjs[obj_id]
        );
        new_obj.isClickable = false;
        state.setVizObj(obj_id, new_obj);

        // If capacity is reached, deactivate the control
        if (updatedControl.selected.length >= updatedControl.capacity) {
          const deactivatedControl = updatedControl.setIsActive(false);
          state.setControl(control.id, deactivatedControl);
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

// Function to remove a object that has been selected given the id of the SelectControl
export const DeSelectObjectControl =
  (state: State) => (obj_id: number, control_id: number) => {
    // may be too expensive redo if necessary
    const control = state.controls[control_id] as SelectControl;
    if (obj_id in state.vizobjs) {
      const select_obj = control.deselectObj(obj_id);
      const updatedState = select_obj[0];
      if (select_obj[1]) {
        // if the deselection was successful
        const new_obj = Object.assign(
          Object.create(Object.getPrototypeOf(state.vizobjs[obj_id])),
          state.vizobjs[obj_id]
        );
        new_obj.isClickable = true; // make the deselected object clickable again
        state.setVizObj(obj_id, new_obj);
      }
      state.setControl(control.id, updatedState);
    }
  };

// Function to set the active state of a particular SelectControl given its id
export const SetIsActiveSelectControl =
  (control_id: number) => (state: State) => (val: boolean) => {
    state.SetIsActiveSelectControl(control_id)(val);
  };

export const getStateName = (state: State) => state.state_name;

export const getNameSelector = (state: State) => (id: number) =>
  state.vizobjs[id].name;

export const getPlacementSelector = (id: number) => (state: State) => state.placement[id];

export const getPlacementSelector2 = (state: State) => (id: number) => state.placement[id];

export const getPlacementListSelector = (state: State) => Object.values(state.placement);

export const DeleteVizObjSelector = (state: State) => (id: number) => {
  return state.deleteVizObj(id);
};

export const UpdateValidationSelector = (state: State) => () => {
  state.updateValidations();
};

export const getValidationsSelector = (state: State) => state.validations;

export const UpdateAllInfluencesSelector = (state: State) =>
  state.updateAllInfluences;


/* new */

export const isPlacementModeActive2 = (state: State) => (id: number) => {
  return state.placement[id].isPlacementActive
};

export const setIsPlacementModeActive2 = (state: State) => (id: number, val: boolean) => {
  state.setIsPlacementModeIndividual(id, val);
}

export const getNumObjectsPlaced = (state: State) => (id: number) => {
  return state.placement[id].numObjectsPlaced
}

export const setNumObjectsPlaced = (state: State) => (id: number, num: number) => {
  state.setNumObjectsPlaced(id, num)
}
/* new */

export const setMultiChoiceOptionsSelector =
  (state: State) => (control_id: number, Selectedoptions: number[]) => {
    state.setMultiChoiceOptions(control_id, Selectedoptions);
  };

export const setControlSelector = (state: State) => (control_id: number, new_obj: Control) => {
  state.setControl(control_id, new_obj);
}

export const setInputNumberValueSelector =
  (control_id: number) => (state: State) => (value: number | "") => {
    state.setInputNumberValue(control_id)(value);
  };

export const setEnablerControl =
  (control_id: number) => (state: State) => (isEnabled: boolean) => {
    state.setEnablerControl(control_id)(isEnabled);
  };

export const getQuestionsSelector = (state: State) => (question_id: number) =>
  state.questions[question_id];

export const getTitleSelector = (state: State) => state.title;

export const getOrderSelector = (state: State) => state.order;

export const isValidatorClickableSelector = (state: State) =>
  !state.isActivePlacement && !state.isSelectActive;

export const addQuestionEditor =
  (state: State) => (question_id: number) => (question: string) => {
    state.addQuestion(question_id, question);
  };

export const addMCQuestionEditor = 
  (state: State) => (id: number, title: string, desc: string, options: Option[]) => {
    state.addMCQuestion(id, title, desc, options);
  };

export const addElementSelector = (state: State) => (element: EditAddType) => {
  state.addElement(element);
}