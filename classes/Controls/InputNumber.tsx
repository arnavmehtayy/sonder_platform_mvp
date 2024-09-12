import { Control } from "./Control";
import { useStore, setInputNumberValueSelector } from "@/app/store";
import Latex from "react-latex-next";
import React from "react";
import { Interface } from "readline";
import { ControlConstructor } from "./Control";
import { EditableObjectPopup, EditableObjectPopupProps } from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";

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
}

function ShowInputNumber({control} : {control: InputNumber}) {
  const setValue = useStore(setInputNumberValueSelector(control.id));
    const value = control.value;
    const isClickable = control.isClickable;

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
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          <Latex>{control.desc}</Latex>
        </h3>
        <p className="text-gray-600 mb-2">
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
  }: Partial<InputNumberConstructor> & { id: number, value: number }) {
    super({ id: id, desc: desc, text: text });
    this.value = value;
    this.placeholder = placeholder;
    this.initial_value = initial_value;
    this.min = min;
    this.max = max;
    this.step = step;
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

  render(): React.ReactNode {
    return <ShowInputNumber control={this} />;
    
  }

  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (obj: InputNumber) => void;
  }) {
    const [editedObject, setEditedObject] = React.useState<InputNumberConstructor>({
      id: Date.now(),
      value: 0,
      desc: "input a number",
      text: "here you need to input a number",
      placeholder: "number",
      initial_value: 0,
      min: 0,
      max: 100,
      step: 1,
    });

    const popupProps: EditableObjectPopupProps<InputNumberConstructor> = {
      isOpen,
      onClose,
      object: editedObject,
      set_object: setEditedObject,
      onSave: (updatedObject: InputNumberConstructor) => {
        const newObj = new InputNumber(updatedObject);
        onSave(newObj);
      },
      title: `Create New Input Number`,
      fields: [
        { key: "desc", label: "Description", type: "title" },
        { key: "text", label: "Text", type: "textarea" },
        { key: "placeholder", label: "Placeholder", type: "text" },
        { key: "initial_value", label: "Initial Value", type: "number" },
        { key: "min", label: "Minimum Value", type: "number" },
        { key: "max", label: "Maximum Value", type: "number" },
        { key: "step", label: "Step", type: "number" },
      ],
    };
    return <EditableObjectPopup {...popupProps} />;
  }

}
