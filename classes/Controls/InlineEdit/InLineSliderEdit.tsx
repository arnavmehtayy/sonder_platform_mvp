import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Plus, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { SliderControlAdvanced } from '@/classes/Controls/SliderControlAdv';
import { setSliderControlValueSelector, getSliderControlValueSelector, useStore, getObjectSelector } from '@/app/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FunctionStr, FunctionStrEditor } from '../FunctionStr';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { obj } from '@/classes/vizobjects/obj';

interface InlineSliderEditProps {
  control: SliderControlAdvanced<any>;
  onClose: () => void;
}

export const InlineSliderEdit: React.FC<InlineSliderEditProps> = ({ control, onClose }) => {
  const [editedValues, setEditedValues] = React.useState({
    desc: control.desc,
    text: control.text,
    range: control.range,
    step_size: control.step_size,
    obj_id: control.obj_id,
    attribute_pairs: [...control.attribute_JSON]
  });
  
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [showAttributes, setShowAttributes] = React.useState(false);
  
  const setControl = useStore(state => state.setControl);
  const setValue = useStore(setSliderControlValueSelector(control.id));
  const getValue = useStore(getSliderControlValueSelector(control.id));
  const object = useStore(getObjectSelector(editedValues.obj_id));
  const allObjects = useStore(state => state.vizobjs);
  const setAttributeOptions = object?.get_set_att_selector("number") || {};

  const handleSave = () => {
    const updatedControl = new SliderControlAdvanced({
      id: control.id,
      obj_id: editedValues.obj_id,
      desc: editedValues.desc,
      text: editedValues.text,
      range: editedValues.range,
      step_size: editedValues.step_size,
      attribute_pairs: editedValues.attribute_pairs
    });
    setControl(control.id, updatedControl);
    onClose();
  };

  const addAttributePair = () => {
    if (Object.keys(setAttributeOptions).length > 0) {
      const firstKey = Object.keys(setAttributeOptions)[0];
      setEditedValues(prev => ({
        ...prev,
        attribute_pairs: [
          ...prev.attribute_pairs,
          {
            transform_function: new FunctionStr("x", []),
            func: firstKey,
            obj_type: object?.type || 'Obj'
          }
        ]
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 relative space-y-4 max-w-full">
      {/* Basic Information Section */}
      <div className="space-y-3">
        <div>
          <Label className="text-xs text-gray-500">Title</Label>
          <Input
            value={editedValues.desc}
            onChange={(e) => setEditedValues(prev => ({ ...prev, desc: e.target.value }))}
            className="text-lg font-semibold text-blue-800"
          />
        </div>
        
        <div>
          <Label className="text-xs text-gray-500">Description</Label>
          <Input
            value={editedValues.text}
            onChange={(e) => setEditedValues(prev => ({ ...prev, text: e.target.value }))}
            className="text-gray-600"
          />
        </div>
      </div>

      <Separator />

      {/* Slider Configuration - Reformatted */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Step Size</Label>
            <Input
              type="number"
              // value={editedValues.step_size}
              onChange={(e) => setEditedValues(prev => ({ 
                ...prev, 
                step_size: Number(e.target.value) 
              }))}
              className="w-full"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Range</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                // value={editedValues.range[0]}
                onChange={(e) => setEditedValues(prev => ({ 
                  ...prev, 
                  range: [Number(e.target.value), prev.range[1]] 
                }))}
                className="w-full"
              />
              <span className="text-sm">to</span>
              <Input
                type="number"
                // value={editedValues.range[1]}
                onChange={(e) => setEditedValues(prev => ({ 
                  ...prev, 
                  range: [prev.range[0], Number(e.target.value)] 
                }))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Preview Slider */}
        <div className="w-full">
          <Label className="text-xs text-gray-500">Preview</Label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={editedValues.range[0]}
              max={editedValues.range[1]}
              step={editedValues.step_size}
              value={getValue}
              onChange={(e) => setValue(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-gray-700 font-medium">{getValue}</span>
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
      </div>

      {/* <Separator />

      {/* Object Control Section *//*}
      <Collapsible open={showAttributes} onOpenChange={setShowAttributes}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex justify-between items-center"
          >
            Object Control Settings
            {showAttributes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          {/* Object Selection *//*}
          <div>
            <Label className="text-xs text-gray-500">Control Object</Label>
            <Select
              value={editedValues.obj_id.toString()}
              onValueChange={(value) => setEditedValues(prev => ({ 
                ...prev, 
                obj_id: Number(value),
                attribute_pairs: [] // Reset attributes when object changes
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select object to control" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(allObjects).map((obj: obj) => (
                  <SelectItem key={obj.id} value={obj.id.toString()}>
                    {obj.name || `Object ${obj.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Attribute Pairs *//*}
          {editedValues.obj_id !== -1 && (
            <div className="space-y-2">
              {editedValues.attribute_pairs.map((pair, index) => (
                <div key={index} className="space-y-2 p-2 border rounded">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-gray-500">Attribute to Control</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newPairs = editedValues.attribute_pairs.filter((_, i) => i !== index);
                        setEditedValues(prev => ({ ...prev, attribute_pairs: newPairs }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Select
                    value={pair.func}
                    onValueChange={(value) => {
                      const newPairs = [...editedValues.attribute_pairs];
                      newPairs[index] = { ...pair, func: value };
                      setEditedValues(prev => ({ ...prev, attribute_pairs: newPairs }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select attribute" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(setAttributeOptions).map((attr) => (
                        <SelectItem key={attr} value={attr}>{attr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Transform Function *//*}
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full flex justify-between items-center">
                        <span className="text-xs">Transform Function</span>
                        <Settings className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <FunctionStrEditor
                        value={pair.transform_function}
                        onChange={(value) => {
                          const newPairs = [...editedValues.attribute_pairs];
                          newPairs[index] = { ...pair, transform_function: value };
                          setEditedValues(prev => ({ ...prev, attribute_pairs: newPairs }));
                        }}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={addAttributePair}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Attribute
              </Button>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible> */}

      {/* Save/Cancel Buttons */}
      <div className="flex justify-end space-x-2 mt-4">
        <Button 
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button 
          variant="default"
          size="sm"
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Check className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  );
};