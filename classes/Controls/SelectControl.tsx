
import { Control, ControlConstructor } from "./Control";
import { obj } from "../vizobjects/obj";
import {
  useStore,
  DeSelectObjectControl,
  SetIsActiveSelectControl,
  getNameSelector,
} from "@/app/store";
import React from "react";
import Latex from "react-latex-next";
import {
  EditableObjectPopup,
  EditableObjectPopupProps,
} from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";

import Validation_select, { Validation_selectConstructor, ValidationSelectEditor } from "../Validation/Validation_select";

/*
 * This is the class that holds information about the select control
 * The select control is used to select objects on the three.js screen 
 * the attributes of this class are: 
 * selectable (set of objects that can be selected), 
 * selected (the objects that have been selected), 
 * isActive (if this select has been activated using the isActive button), 
 * capacity (the total number of objects that can be selected at a time)

*/
function ShowSelectControl({ control }: { control: SelectControl }) {
  const handleRemove = useStore(DeSelectObjectControl);
  const setIsActive = useStore(SetIsActiveSelectControl(control.id));
  const getName = useStore(getNameSelector);
  const [isComponentActive, setIsComponentActive] = React.useState(
    control.isClickable && control.isActive
  );

  React.useEffect(() => {
    setIsActive(isComponentActive);
  }, [isComponentActive]);

  React.useEffect(() => {
    if (control.selected.length >= control.capacity) {
      setIsComponentActive(false);
      setIsActive(false);
    }
  }, [control.selected.length, control.capacity]);

  const handleClick = () => {
    if (control.isClickable) {
      const newState = !isComponentActive;
      setIsComponentActive(newState);
      setIsActive(newState);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 ${
        !control.isClickable ? "opacity-70" : ""
      } relative`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-800">
          <Latex>{control.desc}</Latex>
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {control.selected.length}/{control.capacity} selected
          </span>
          <button
            onClick={handleClick}
            disabled={!control.isClickable}
            className={`
          ${
            isComponentActive
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 hover:bg-gray-500"
          }
          ${!control.isClickable && "opacity-50 cursor-not-allowed"}
          text-white py-1 px-3 rounded-md text-sm font-medium transition duration-300 ease-in-out
          flex items-center
        `}
          >
            {isComponentActive ? "Active" : "Inactive"}
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-4">
        <Latex>{control.text}</Latex>
      </p>

      <div className="space-y-3">
        {control.selected.map((id) => (
          <div
            key={id}
            className={`
          w-full text-left px-4 py-3 rounded-lg 
          transition-all duration-400 ease-out
          transform hover:scale-[1.02] active:scale-[0.98]
          bg-blue-800 text-white shadow-md
          ${!control.isClickable ? "cursor-not-allowed" : "cursor-pointer"}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-5 h-5 mr-3 rounded-full border-2 flex-shrink-0 border-white bg-white scale-110">
                  <svg
                    className="w-3 h-4 text-blue-800 mx-auto mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-left font-medium truncate">
                  {getName(id)}
                </span>
              </div>
              <button
                className="text-white hover:text-red-200 transition duration-300"
                onClick={() => handleRemove(id, control.id)}
                aria-label="Remove item"
                disabled={!control.isClickable}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SelectControlConstructor extends ControlConstructor {
  selectable: number[];
  selected?: number[];
  isActive?: boolean;
  capacity?: number;
}
export class SelectControl extends Control {
  selectable: number[]; // This is the list of id's that a user can select using this select control
  selected: number[]; // This is the list of id's of the objects that have been selected by the user
  isActive: boolean; // This is true if the user has clicked the isActive button to activate the select control
  capacity: number; // This is the maximum number of objects that can be selected at a time

  constructor({
    id,
    selectable,
    selected = [],
    isActive = false,
    capacity = 1,
    desc = "select control",
    text = "this is a select control",
  }: SelectControlConstructor) {
    super({ id: id, desc: desc, text: text });
    this.selectable = selectable;
    this.selected = selected;
    this.isActive = isActive;
    this.capacity = capacity;
  }

  // change if this select state has been activated using the isActive button. This is used by the storage system
  setIsActive(state: boolean): SelectControl {
    const clone = this.clone();
    clone.isActive = state;
    return clone;
  }

  // method ot try to select an object with the given id. This is used by the storage system
  // returns a tuple with the new select control with the updated selected list and a boolean indicating if the object was successfully added
  SelectObj(obj_id: number): [SelectControl, boolean] {
    if (this.selected.length < this.capacity && this.isActive) {
      // check if obj_id does not already exist in the array
      if (!this.selected.includes(obj_id) && this.selectable.includes(obj_id)) {
        const new_selected = this.clone();
        new_selected.selected.push(obj_id);
        return [new_selected, true];
      } else {
        console.log("Object already selected or not selectable");
      }
    } else {
      console.log("Cannot select more than capacity");
    }
    return [this, false];
  }

  // method to deselect an object with the given id. This is used by the storage system
  // returns a tuple with the new select control with the updated selected list and a boolean indicating if the object was successfully removed
  deselectObj(obj_id: number): [SelectControl, boolean] {
    if (this.selected.includes(obj_id)) {
      const new_selected = this.clone();
      new_selected.selected = new_selected.selected.filter(
        (id: number) => id !== obj_id
      );
      return [new_selected, true];
    } else {
      console.log("Object was never selected");
    }
    return [this, false];
  }

  countSelected() {
    return this.selected.length;
  }

  dataBaseSave(): SelectControlConstructor & { type: string } {
    return {
      id: this.id,
      selectable: this.selectable,
      selected: this.selected,
      isActive: this.isActive,
      capacity: this.capacity,
      desc: this.desc,
      text: this.text,
      type: "SelectControl",
    };
  }

  render(): React.ReactNode {
    return <ShowSelectControl control={this} />;
  }

  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (obj: SelectControl, validation?: Validation_select) => void;
  }) {
    const [editedObject, setEditedObject] =
      React.useState<SelectControlConstructor>({
        id: Date.now() % 10000,
        selectable: [],
        capacity: 1,
        desc: "select control",
        text: "this is a select control",
      });
      const [validation, setValidation] = React.useState<Validation_selectConstructor | undefined>(undefined);

    const handleChange = (field: string, value: any) => {
      setEditedObject((prev) => ({ ...prev, [field]: value }));
    };

    const popupProps: EditableObjectPopupProps<SelectControlConstructor> = {
      isOpen,
      onClose,
      object: editedObject,
      set_object: setEditedObject,
      onSave: (updatedObject: SelectControlConstructor) => {
        const newObj = new SelectControl(updatedObject);
        const newVal = validation ? new Validation_select(validation) : undefined;
        onSave(newObj, newVal);
      },
      title: `Create New Select Control`,
      fields: [
        { key: "desc", label: "Title", type: "title" },
        { key: "text", label: "Text", type: "textarea" },
        {
          key: "selectable",
          label: "Selectable Objects",
          type: "vizObjSelectList",
        },
        { key: "capacity", label: "Capacity", type: "number" },
      ],
      additionalContent: (
        <ValidationSelectEditor
          onChange={(newValidation: Validation_selectConstructor | undefined) => setValidation(newValidation)}
          controlId={editedObject.id}
          selectableObjects={editedObject.selectable}
        />
      ),
    };

    return <EditableObjectPopup {...popupProps} />;
  }
}
