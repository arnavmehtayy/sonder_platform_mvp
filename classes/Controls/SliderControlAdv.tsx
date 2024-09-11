import { obj } from "../vizobjects/obj";
import { SliderControl, SliderControlConstructor } from "./SliderControl";
import { useStore, setSliderControlValueSelector, getSliderControlValueSelector } from "@/app/store";
import {
    EditableObjectPopup,
    EditableObjectPopupProps,
  } from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import React from 'react';
import Latex from 'react-latex-next';
import { ShowSliderControl } from "./SliderControl";
import * as math from 'mathjs';

interface AttributePair<T extends obj> {
  transform_function: string;
  set_attribute: (obj: T, value: number) => T;
}

export interface SliderControlAdvancedConstructor<T extends obj> extends SliderControlConstructor<T> {
  attribute_pairs: AttributePair<T>[];
}

// export function ShowSliderControl({control} : {control: SliderControlAdvanced<any>}) {
//   const setValue = useStore(setSliderControlValueSelector(control.id));
//   const getValue = useStore(getSliderControlValueSelector(control.id));

//   return (
//     <div className={`bg-white rounded-lg shadow-md p-4 ${!control.isClickable ? "opacity-50" : ""} relative`}>
//       <h3 className="text-lg font-semibold text-blue-800 mb-2">
//         <Latex>{control.desc}</Latex>
//       </h3>
//       <p className="text-gray-600 mb-2">
//         <Latex>{control.text}</Latex>
//       </p>
//       <div className="relative pt-1">
//         <input
//           type="range"
//           min={control.range[0]}
//           max={control.range[1]}
//           step={control.step_size}
//           value={getValue}
//           onChange={(e) => setValue(Number(e.target.value))}
//           className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
//           disabled={!control.isClickable}
//         />
//         <div className="flex justify-between items-center mt-2">
//           <span className="text-sm text-gray-600">{control.range[0]}</span>
//           <span className="text-sm font-medium text-blue-600">
//             {getValue.toFixed(2)}
//           </span>
//           <span className="text-sm text-gray-600">{control.range[1]}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

export class SliderControlAdvanced<T extends obj> extends SliderControl<T> {
  attribute_pairs: AttributePair<T>[];
  localValue: number;

  constructor({
    id,
    obj_id,
    range,
    step_size = 1,
    attribute_pairs,
    desc = "advanced slider control",
    text = "this is an advanced slider control",
  }: SliderControlAdvancedConstructor<T>) {
    super({ id, obj_id, range, step_size, get_attribute: () => 0, set_attribute: () => ({} as T), desc, text });
    this.attribute_pairs = attribute_pairs;
    this.localValue = (range[0] + range[1]) / 2; // Initialize local value to the middle of the range
  }

  setSliderValue(obj: T, value: number): T {
    this.localValue = value; // Update the local value
    if (obj) {
      return this.attribute_pairs.reduce((updatedObj, pair) => {
        const transformedValue = this.evaluateTransformFunction(pair.transform_function, value);
        return pair.set_attribute(updatedObj, transformedValue);
      }, obj);
    } else {
      return obj;
    }
  }

  private evaluateTransformFunction(expression: string, value: number): number {
    try {
      const scope = { x: value };
      return math.evaluate(expression, scope);
    } catch (error) {
      console.error(`Error evaluating transform function: ${error}`);
      return value; // Return original value if there's an error
    }
  }

  getSliderValue(): number {
    return this.localValue;
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
    onSave: (obj: SliderControlAdvanced<any>) => void;
  }) {
    const [editedObject, setEditedObject] = React.useState<SliderControlAdvancedConstructor<any>>({
      id: Date.now(),
      obj_id: -1,
      range: [0, 100],
      step_size: 1,
      attribute_pairs: [],
    });

    const popupProps: EditableObjectPopupProps<SliderControlAdvancedConstructor<any>> = {
      isOpen,
      onClose,
      object: editedObject,
      onSave: (updatedObject: SliderControlAdvancedConstructor<any>) => {
        const newObj = new SliderControlAdvanced(updatedObject);
        onSave(newObj);
      },
      title: `Create New Advanced Slider Control`,
      fields: [
        { key: "obj_id", label: "Object ID", type: "number" },
        { key: "step_size", label: "Step Size", type: "number" },
        {key: "range", label: "Range", type: "arraynum", length_of_array: 2},
        {
          key: "attribute_pairs",
          label: "Attribute Pairs",
          type: "custom",
          render: (value, onChange) => (
            <AttributePairsEditor
              pairs={value}
              onChange={onChange}
            />
          ),
        },
      ],
    };

    return <EditableObjectPopup {...popupProps} />;
  }
}

interface AttributePairsEditorProps {
  pairs: AttributePair<any>[];
  onChange: (pairs: AttributePair<any>[]) => void;
}

function AttributePairsEditor({ pairs, onChange }: AttributePairsEditorProps) {
  const addPair = () => {
    onChange([...pairs, { transform_function: "x", set_attribute: (obj, value) => obj }]);
  };

  const updatePair = (index: number, field: keyof AttributePair<any>, value: any) => {
    const newPairs = [...pairs];
    newPairs[index] = { ...newPairs[index], [field]: value };
    onChange(newPairs);
  };

  const removePair = (index: number) => {
    onChange(pairs.filter((_, i) => i !== index));
  };

  return (
    <div>
      {pairs.map((pair, index) => (
        <div key={index} className="mb-2">
          <input
            type="text"
            value={pair.transform_function}
            onChange={(e) => updatePair(index, "transform_function", e.target.value)}
            placeholder="Transform function (e.g., 2*x + 1)"
            className="w-full p-2 border rounded"
          />
          <button onClick={() => removePair(index)} className="mt-1 px-2 py-1 bg-red-500 text-white rounded">
            Remove
          </button>
        </div>
      ))}
      <button onClick={addPair} className="px-2 py-1 bg-blue-500 text-white rounded">
        Add Attribute Pair
      </button>
    </div>
  );
}