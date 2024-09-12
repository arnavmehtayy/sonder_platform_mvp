import { obj } from "../vizobjects/obj";
import { SliderControl, SliderControlConstructor } from "./SliderControl";
import { useStore, setSliderControlValueSelector, getSliderControlValueSelector, getObjectSelector } from "@/app/store";
import {
    EditableObjectPopup,
    EditableObjectPopupProps,
  } from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import React from 'react';
import Latex from 'react-latex-next';
import { ShowSliderControl } from "./SliderControl";
import * as math from 'mathjs';
import { Button } from "@/components/ui/button";
import { X } from "react-feather";

interface AttributePair<T extends obj> {
  transform_function: string;
  set_attribute: (obj: T, value: number) => T;
}

export interface SliderControlAdvancedConstructor<T extends obj> extends SliderControlConstructor<T> {
  attribute_pairs: AttributePair<T>[];
}

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
      set_object: setEditedObject,
      onSave: (updatedObject: SliderControlAdvancedConstructor<any>) => {
        const newObj = new SliderControlAdvanced(updatedObject);
        onSave(newObj);
      },
      title: `Create New Advanced Slider Control`,
      fields: [
        { key: "obj_id", label: "Object ID", type: "vizObjSelect" },
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
              objectId={editedObject.obj_id}
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
  objectId: number;
}

export default function AttributePairsEditor({ pairs, onChange, objectId }: AttributePairsEditorProps) {
  const object = useStore(getObjectSelector(objectId));
  const setAttributeOptions = object ? object.get_set_att_selector("number") : [];
  console.log(object, setAttributeOptions)

  const addPair = () => {
    if (setAttributeOptions.length > 0) {
      onChange([...pairs, { 
        transform_function: "", 
        set_attribute: setAttributeOptions[0].set_attribute 
      }]);
    }
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
            className="w-full p-2 border rounded mb-2"
          />
          <select
            value={setAttributeOptions.findIndex(attr => attr.set_attribute === pair.set_attribute)}
            onChange={(e) => {
              const selectedIndex = parseInt(e.target.value);
              updatePair(index, "set_attribute", setAttributeOptions[selectedIndex].set_attribute);
            }}
            className="w-full p-2 border rounded mb-2"
          >
            {setAttributeOptions.map((attr, attrIndex) => (
              <option key={attrIndex} value={attrIndex}>
                {attr.label}
              </option>
            ))}
          </select>
          <Button
            onClick={() => removePair(index)}
            variant="ghost"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
          
        </div>
      ))}
      <Button onClick={addPair} variant="outline" className="mt-3">
        Add Attribute Pair
      </Button>
    </div>
  );
}