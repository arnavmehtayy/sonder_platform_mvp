import { obj } from "../vizobjects/obj";
import { Control, ControlConstructor } from "./Control";
import {
  useStore,
  setSliderControlValueSelector,
  getSliderControlValueSelector,
} from "@/app/store";
import React from "react";
import Latex from "react-latex-next";
import {
  EditableObjectPopup,
  EditableObjectPopupProps,
} from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

/*
 *  This is the class that holds information about the slider control
 *  The slider control is used to change the value of an attribute of an object using a number slider
 * the attributes of this class are:
 * obj_id (object who the control is controlling)
 * range, step_size,
 * get_attribute (function to get the attribute of the object that the control is controlling),
 * set_attribute (function to set the attribute of the object that the control is controlling)
 */
// This class is the base class used to create a slider control for any object in the scene

export interface SliderControlConstructor<T extends obj>
  extends ControlConstructor {
  obj_id: number;
  range: [number, number];
  step_size?: number;
  get_attribute?: (obj: T) => number;
  set_attribute?: (obj: T, value: number) => T;
}

export function ShowSliderControl({
  control,
  onEdit,
  onSetAutograder,
}: {
  control: SliderControl<any>;
  onEdit?: () => void;
  onSetAutograder?: () => void;
}) {
  const setValue = useStore(setSliderControlValueSelector(control.id));
  const value = useStore(getSliderControlValueSelector(control.id));
  const isEditMode = useStore((state) => state.isEditMode);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 relative">
      <h3 className="text-lg font-semibold text-blue-800 mb-1">
        <Latex>{control.desc}</Latex>
      </h3>

      {isEditMode && (
        <div className="flex mt-2 mb-3 space-x-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 text-sm transition-colors"
            >
              <Pencil className="h-3.5 w-3.5 mr-1" />
              Edit
            </button>
          )}

          {onSetAutograder && (
            <button
              onClick={onSetAutograder}
              disabled={onEdit === undefined}
              className="flex items-center px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded border border-green-200 text-sm transition-colors disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 mr-1"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              Autograder
            </button>
          )}
        </div>
      )}

      <p className="text-gray-600 mb-4">
        <Latex>{control.text}</Latex>
      </p>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={control.range[0]}
          max={control.range[1]}
          step={control.step_size}
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          className="flex-1"
        />
        <span className="text-gray-700 font-medium">{value}</span>
      </div>
      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          margin: 10px 0;
          width: 100%;
        }
        input[type="range"]:focus {
          outline: none;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 8px;
          cursor: pointer;
          animate: 0.2s;
          background: #bfdbfe;
          border-radius: 4px;
        }
        input[type="range"]::-webkit-slider-thumb {
          border: 2px solid #3b82f6;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -8px;
          transition: all 0.15s ease-in-out;
        }
        input[type="range"]:focus::-webkit-slider-runnable-track {
          background: #93c5fd;
        }
        input[type="range"]::-moz-range-track {
          width: 100%;
          height: 8px;
          cursor: pointer;
          animate: 0.2s;
          background: #bfdbfe;
          border-radius: 4px;
        }
        input[type="range"]::-moz-range-thumb {
          border: 2px solid #3b82f6;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease-in-out;
        }
        input[type="range"]:hover::-webkit-slider-thumb,
        input[type="range"]:hover::-moz-range-thumb {
          transform: scale(1.1);
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        input[type="range"]:active::-webkit-slider-thumb,
        input[type="range"]:active::-moz-range-thumb {
          background: #3b82f6;
        }
        input[type="range"]:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        input[type="range"]:disabled::-webkit-slider-thumb {
          background: #ccc;
          border-color: #999;
          cursor: not-allowed;
        }
        input[type="range"]:disabled::-moz-range-thumb {
          background: #ccc;
          border-color: #999;
          cursor: not-allowed;
        }
        input[type="range"]:disabled:hover::-webkit-slider-thumb,
        input[type="range"]:disabled:hover::-moz-range-thumb {
          transform: none;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}

export class SliderControl<T extends obj> extends Control {
  obj_id: number; // This is the id of the object that the control is controlling
  range: [number, number];
  step_size: number;
  get_attribute: (obj: T) => number; // Function to get the attribute of the object
  set_attribute: (obj: T, value: number) => T; // Function to set the attribute of the object
  constructor({
    id,
    obj_id,
    range,
    step_size = 1,
    get_attribute = (obj: T) => {
      console.log("default SliderControl");
      return 0;
    },
    set_attribute = (obj: T, value: number) => {
      console.log("default SliderControl");
      return obj;
    },
    desc = "slider control",
    text = "this is a slider control",
  }: SliderControlConstructor<T>) {
    super({ id: id, desc, text: text });
    this.obj_id = obj_id;
    this.range = range;
    this.step_size = step_size;
    this.get_attribute = get_attribute;
    this.set_attribute = set_attribute;
  }

  // method to get the value of the slider control given the instance of the object that the control is controlling
  getSliderValue(obj: T): number {
    if (obj) {
      return this.get_attribute(obj as T);
    } else {
      return 0;
    }
  }

  // method that returns a new object of the controller object with the attribute set to the relevant value
  setSliderValue(obj: T, value: number): T {
    if (obj) {
      return this.set_attribute(obj as T, value);
    } else {
      return obj;
    }
  }

  dataBaseSave(): SliderControlConstructor<T> & { type: string } {
    return {
      id: this.id,
      desc: this.desc,
      text: this.text,
      obj_id: this.obj_id,
      range: this.range,
      step_size: this.step_size,
      type: "SliderControl",
    };
  }

  render(): React.ReactNode {
    return <ShowSliderControl control={this} />;
  }
  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (obj: SliderControl<any>) => void;
  }) {
    const [editedObject, setEditedObject] = React.useState<
      SliderControlConstructor<any>
    >({
      id: Date.now() % 10000,
      obj_id: -1,
      range: [0, 100],
      step_size: 1,
    });

    const popupProps: EditableObjectPopupProps<SliderControlConstructor<any>> =
      {
        isOpen,
        onClose,
        object: editedObject,
        set_object: setEditedObject,
        onSave: (updatedObject: SliderControlConstructor<any>) => {
          const newObj = new SliderControl(updatedObject);
          onSave(newObj);
        },
        title: `Create New Multiple Choice Question`,
        fields: [
          { key: "obj_id", label: "Object ID", type: "number" },
          { key: "step_size", label: "Step Size", type: "number" },
        ],
      };

    return <EditableObjectPopup {...popupProps} />;
  }
}
