import { obj, object_types } from "../vizobjects/obj";
import { SliderControl, SliderControlConstructor } from "./SliderControl";
import {
  useStore,
  setSliderControlValueSelector,
  getSliderControlValueSelector,
  getObjectSelector,
} from "@/app/store";
import {
  EditableObjectPopup,
  EditableObjectPopupProps,
} from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import React from "react";
import Latex from "react-latex-next";
import { ShowSliderControl } from "./SliderControl";
import { Button } from "@/components/ui/button";
import { X } from "react-feather";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { atts, dict_get_attributes} from "../vizobjects/get_set_obj_attributes";
import { FunctionStr, FunctionStrEditor } from './FunctionStr';

export interface AttributePairSet {
  transform_function: FunctionStr;
  set_attribute: (obj: any, value: any) => any;
}

export interface AttributePairSet_json {
  transform_function: FunctionStr;
  func: string;
  obj_type: object_types;
}

export interface SliderControlAdvancedConstructor<T extends obj>
  extends SliderControlConstructor<T> {
  attribute_pairs: AttributePairSet_json[];
}

export class SliderControlAdvanced<T extends obj> extends SliderControl<T> {
  attribute_pairs: AttributePairSet[];
  attribute_JSON: AttributePairSet_json[];
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
    super({
      id,
      obj_id,
      range,
      step_size,
      get_attribute: () => 0,
      set_attribute: () => ({} as T),
      desc,
      text,
    });
    console.log(attribute_pairs);
    this.attribute_pairs = attribute_pairs.map(
      (pair: AttributePairSet_json) => {
        return {
          transform_function: pair.transform_function,
          set_attribute: atts[pair.obj_type]!["number"][pair.func].set_attribute
        }
      }
    );
    this.attribute_JSON = attribute_pairs;
    
    this.localValue = (range[0] + range[1]) / 2;
  }

  setSliderValue(obj: T, value: number): T {
    this.localValue = value;
    if (obj) {
      return this.attribute_pairs.reduce((updatedObj, pair) => {
        const transformedValue = pair.transform_function.get_function()(value, useStore.getState);
        return pair.set_attribute(updatedObj, transformedValue);
      }, obj);
    } else {
      return obj;
    }
  }

  getSliderValue(obj: T): number {
    return this.localValue;
  }

  dataBaseSave(): SliderControlAdvancedConstructor<T> & { type: string } {
    return {
      id: this.id,
      desc: this.desc,
      text: this.text,
      obj_id: this.obj_id,
      range: this.range,
      step_size: this.step_size,
      attribute_pairs: this.attribute_JSON,
      type: "SliderControlAdv",
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
    onSave: (obj: SliderControlAdvanced<any>) => void;
  }) {
    const [editedObject, setEditedObject] = React.useState<
      SliderControlAdvancedConstructor<any>
    >({
      id: Date.now() % 10000,
      obj_id: -1,
      range: [0, 100],
      step_size: 1,
      attribute_pairs: [],
    });

    const popupProps: EditableObjectPopupProps<
      SliderControlAdvancedConstructor<any>
    > = {
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
        
        { key: "desc", label: "Title", type: "title" },
        { key: "text", label: "Desc", type: "textarea" },
        { key: "step_size", label: "Step Size", type: "number" },
        { key: "range", label: "Range", type: "arraynum", length_of_array: 2 },
        { key: "obj_id", label: "Object ID", type: "vizObjSelect" },
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
  pairs: AttributePairSet_json[];
  onChange: (pairs: AttributePairSet_json[]) => void;
  objectId: number;
}

export function AttributePairsEditor({
  pairs,
  onChange,
  objectId,
}: AttributePairsEditorProps) {
  const object = useStore(getObjectSelector(objectId));
  const type = object ? object.type : 'Obj';
  const setAttributeOptions = object
    ? object.get_set_att_selector("number")
    : {};
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const addPair = () => {
    if (Object.keys(setAttributeOptions).length > 0) {
      const firstKey = Object.keys(setAttributeOptions)[0];
      onChange([
        ...pairs,
        {
          transform_function: new FunctionStr(Date.now() % 10000, "x", []),
          func: firstKey,
          obj_type: type
        },
      ]);
    }
  };

  const updatePair = (
    index: number,
    field: keyof AttributePairSet_json,
    value: any
  ) => {
    const newPairs = [...pairs];
    newPairs[index] = { ...newPairs[index], [field]: value };
    onChange(newPairs);
  };

  const removePair = (index: number) => {
    onChange(pairs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="showAdvanced"
          checked={showAdvanced}
          onChange={(e) => setShowAdvanced(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="showAdvanced">Show Advanced Options</label>
      </div>
      {pairs.map((pair, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className="flex-grow space-y-2">
            {showAdvanced && (
              <FunctionStrEditor
                value={pair.transform_function}
                onChange={(value) => updatePair(index, "transform_function", value)}
              />
            )}
            <Select
              value={pair.func}
              onValueChange={(value) => updatePair(index, "func", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select attribute" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(setAttributeOptions).map((attr) => (
                  <SelectItem key={attr} value={attr}>
                    {attr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => removePair(index)}
            variant="ghost"
            size="icon"
            className="self-center"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button onClick={addPair} variant="outline" className="w-full mt-3">
        Add Attribute Pair
      </Button>
    </div>
  );
}