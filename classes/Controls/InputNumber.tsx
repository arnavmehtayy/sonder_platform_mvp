import { Control } from "./Control";
import { useStore, setInputNumberValueSelector } from "@/app/store";
import Latex from "react-latex-next";
import React from "react";
import { Interface } from "readline";
import { ControlConstructor } from "./Control";
import {
  EditableObjectPopup,
  EditableObjectPopupProps,
} from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";

import {
  Validation_inputNumber,
  Validation_inputNumberConstructor,
  ValidationInputNumberEditor,
} from "../Validation/Validation_inputNumber";
import { AttributePairSet_json, AttributePairSet } from "./SliderControlAdv";
import { atts } from "../vizobjects/get_set_obj_attributes";
import { AttributePairsEditor } from "./SliderControlAdv";
import { obj } from "../vizobjects/obj";
import {
  InputNumberControlInsert,
  InputNumberControlSelect,
  AttributePairsInsert,
  AttributePairsSelect,
} from "@/app/db/schema";
import FunctionStr from "./FunctionStr";
import { InlineInputEdit } from "./InlineEdit/InLineInputEdit";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputNumberAutograderEdit } from "./AutogradeEdit/InputNumberAutograderEdit";

/*

 *  This is the class that holds information about the input number control
  *  The input number control is used to input a number into a text box
  * the attributes of this class are: value, placeholder, initial_value, min, max, step

*/
interface InputNumberConstructor extends ControlConstructor {
  value: number;
  placeholder?: string;
  initial_value?: number;
  min?: number;
  max?: number;
  step?: number;
  attribute_pairs?: AttributePairSet_json[];
  obj_id?: number;
}

function ShowInputNumber({
  control,
  onEdit,
  onSetAutograder,
}: {
  control: InputNumber;
  onEdit?: () => void;
  onSetAutograder?: () => void;
}) {
  const setValue = useStore(setInputNumberValueSelector(control.id));
  const value = control.value;
  const isClickable = control.isClickable;
  const isEditMode = useStore((state) => state.isEditMode);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isClickable) return;
    const newValue = e.target.value === "" ? "" : Number(e.target.value);
    setValue(newValue);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 ${
        !isClickable ? "opacity-50" : ""
      } relative`}
    >
      <div className="mb-4">
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
      </div>

      <p className="text-gray-600 mb-3">
        <Latex>{control.text}</Latex>
      </p>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={handleChange}
          placeholder={control.placeholder}
          disabled={!isClickable}
          min={control.min}
          max={control.max}
          step={control.step}
          className={`
              w-full px-3 py-2 text-base rounded-md border transition-all duration-200 ease-in-out
              ${
                isClickable
                  ? "border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  : "bg-gray-100 border-gray-300 cursor-not-allowed"
              }
              focus:outline-none
            `}
        />
      </div>
    </div>
  );
}

export class InputNumber extends Control {
  value: number | ""; // the value of the input number in the box
  placeholder: string; // the text that appears in the box when no value is entered
  initial_value: number; // the initial value of the input number for when the arrows are toggled initially
  min: number;
  max: number;
  step: number;
  attribute_pairs: AttributePairSet[];
  attribute_JSON: AttributePairSet_json[];
  obj_id: number;

  constructor({
    id,
    value = 0,
    desc = "input a number",
    text = "here you need to input a number",
    placeholder = "number",
    initial_value = 0,
    min = 0,
    max = 100,
    step = 1,
    obj_id = -1,
    attribute_pairs = [],
  }: InputNumberConstructor) {
    super({ id: id, desc: desc, text: text });
    this.value = value;
    this.placeholder = placeholder;
    this.initial_value = initial_value;
    this.min = min;
    this.max = max;
    this.step = step;
    this.attribute_pairs = attribute_pairs.map(
      (pair: AttributePairSet_json) => {
        return {
          transform_function: pair.transform_function,
          set_attribute:
            atts[pair.obj_type]!["number"][pair.func].set_attribute,
        };
      }
    );
    this.attribute_JSON = attribute_pairs;
    this.obj_id = obj_id;
  }

  serialize(): [
    Omit<InputNumberControlInsert, "stateId">,
    Omit<AttributePairsInsert, "stateId">[]
  ] {
    const controlData: Omit<InputNumberControlInsert, "stateId"> = {
      id: this.id,
      controlId: this.id,
      desc: this.desc,
      text: this.text,
      value: this.value === "" ? null : this.value,
      placeholder: this.placeholder,
      initial_value: this.initial_value,
      min: this.min,
      max: this.max,
      step: this.step,
      obj_id: this.obj_id,
    };

    const attributePairs: Omit<AttributePairsInsert, "stateId">[] =
      this.attribute_JSON.map((pair) => ({
        ControlId: this.id,
        trans_functionStr: pair.transform_function.functionString,
        trans_symbols: pair.transform_function.symbols,
        get_func: pair.func,
        obj_type: pair.obj_type,
      }));

    return [controlData, attributePairs];
  }

  static deserialize(
    data: InputNumberControlSelect,
    attributePairs: AttributePairsSelect[]
  ): InputNumber {
    const attribute_pairs: AttributePairSet_json[] = attributePairs.map(
      (pair) => ({
        transform_function: new FunctionStr(
          pair.trans_functionStr,
          pair.trans_symbols
        ),
        func: pair.get_func,
        obj_type: pair.obj_type,
      })
    );

    return new InputNumber({
      id: data.controlId,
      desc: data.desc,
      text: data.text,
      value: data.value ?? 0,
      placeholder: data.placeholder ?? "",
      initial_value: data.initial_value ?? 0,
      min: data.min ?? 0,
      max: data.max ?? 100,
      step: data.step ?? 1,
      obj_id: data.obj_id ?? -1,
      attribute_pairs: attribute_pairs,
    });
  }

  // change the value of the input number used by the storage system
  setValue(value: number | "") {
    const new_obj = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this
    );
    new_obj.value = value;
    return new_obj;
  }

  setControlledObjectValue(value: number | "", obj: obj) {
    this.value = value;
    if (obj) {
      return this.attribute_pairs.reduce((updatedObj, pair) => {
        const transformedValue = pair.transform_function.get_function()(
          value === "" ? this.initial_value : value,
          useStore.getState
        );
        return pair.set_attribute(updatedObj, transformedValue);
      }, obj);
    } else {
      return obj;
    }
  }

  dataBaseSave(): InputNumberConstructor & { type: string } {
    return {
      id: this.id,
      value: this.value || 0,
      desc: this.desc,
      text: this.text,
      placeholder: this.placeholder,
      initial_value: this.initial_value,
      min: this.min,
      max: this.max,
      step: this.step,
      attribute_pairs: this.attribute_JSON,
      type: "InputNumber",
    };
  }

  render(): React.ReactNode {
    return <InputNumberRenderer control={this} />;
  }

  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (obj: InputNumber, validation?: Validation_inputNumber) => void;
  }) {
    const [editedObject, setEditedObject] =
      React.useState<InputNumberConstructor>({
        id: Date.now() % 10000,
        value: 0,
        desc: "Number Input",
        text: "input a number below",
        placeholder: "number",
        initial_value: 0,
        min: -100,
        max: 100,
        step: 0.01,
        obj_id: -1,
        attribute_pairs: [],
      });

    const [useInputControl, setUseInputControl] = React.useState(false);
    const [validation, setValidation] = React.useState<
      Validation_inputNumberConstructor | undefined
    >(undefined);

    const popupProps: EditableObjectPopupProps<InputNumberConstructor> = {
      isOpen,
      onClose,
      object: editedObject,
      set_object: setEditedObject,
      onSave: (updatedObject: InputNumberConstructor) => {
        const newObj = new InputNumber(updatedObject);
        const newVal = validation
          ? new Validation_inputNumber(validation)
          : undefined;
        onSave(newObj, newVal);
      },
      title: `Number Input`,
      fields: [
        { key: "desc", label: "Description", type: "title" },
        { key: "text", label: "Text", type: "textarea" },
        // { key: "placeholder", label: "Placeholder text", type: "text" },
        // { key: "initial_value", label: "value", type: "number" },
        // { key: "min", label: "Minimum Value", type: "number" },
        // { key: "max", label: "Maximum Value", type: "number" },
        // { key: "step", label: "Step", type: "number" },
        // {
        //   label: "",
        //   type: "custom",
        //   render: (_, onChange) => (
        //     <div className="flex items-center mb-4">
        //       <input
        //         type="checkbox"
        //         id="useInputControl"
        //         checked={useInputControl}
        //         onChange={(e) => setUseInputControl(e.target.checked)}
        //         className="mr-2"
        //       />
        //       <label htmlFor="useInputControl">Enable Object Control</label>
        //     </div>
        //   ),
        // },
        // {
        //   key: "obj_id",
        //   label: "Object ID",
        //   type: "vizObjSelect",
        //   showIf: () => useInputControl,
        // },
        // {
        //   key: "attribute_pairs",
        //   label: "Controlled Attribute",
        //   type: "custom",
        //   showIf: () => useInputControl,
        //   render: (value, onChange) => (
        //     <AttributePairsEditor
        //       pairs={value}
        //       onChange={onChange}
        //       objectId={editedObject.obj_id || -1}
        //     />
        //   ),
        // },
      ],
      // additionalContent: (
      //   <ValidationInputNumberEditor
      //     onChange={(
      //       newValidation: Validation_inputNumberConstructor | undefined
      //     ) => setValidation(newValidation)}
      //     controlId={editedObject.id}
      //   />
      // ),
    };
    return <EditableObjectPopup {...popupProps} />;
  }
}

function InputNumberRenderer({ control }: { control: InputNumber }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSettingAutograder, setIsSettingAutograder] = React.useState(false);
  const isEditMode = useStore((state) => state.isEditMode);

  if (isSettingAutograder && isEditMode) {
    return (
      <InputNumberAutograderEdit
        control={control}
        onClose={() => setIsSettingAutograder(false)}
      />
    );
  }

  if (isEditing && isEditMode) {
    return (
      <InlineInputEdit control={control} onClose={() => setIsEditing(false)} />
    );
  }

  return (
    <ShowInputNumber
      control={control}
      onEdit={isEditMode ? () => setIsEditing(true) : undefined}
      onSetAutograder={
        isEditMode ? () => setIsSettingAutograder(true) : undefined
      }
    />
  );
}
