import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Check, X } from 'lucide-react';
import { SliderControlAdvanced } from '@/classes/Controls/SliderControlAdv';
import { setSliderControlValueSelector, getSliderControlValueSelector, useStore } from '@/app/store';
import { ShowSliderControl } from '../SliderControl';
import Latex from 'react-latex-next';

interface InlineSliderEditProps {
  control: SliderControlAdvanced<any>;
}

export const InlineSliderEdit: React.FC<InlineSliderEditProps> = ({ control }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedValues, setEditedValues] = React.useState({
    desc: control.desc,
    text: control.text,
    range: control.range,
    step_size: control.step_size
  });
  
  const setControl = useStore(state => state.setControl);
  const isEditMode = useStore(state => state.isEditMode);
  const setValue = useStore(setSliderControlValueSelector(control.id));
  const getValue = useStore(getSliderControlValueSelector(control.id));

  const handleSave = () => {
    const updatedControl = new SliderControlAdvanced({
      id: control.id,
      obj_id: control.obj_id,
      desc: editedValues.desc,
      text: editedValues.text,
      range: editedValues.range,
      step_size: editedValues.step_size,
      attribute_pairs: control.attribute_JSON
    });
    setControl(control.id, updatedControl);
    setIsEditing(false);
  };

  return (
    <div className="relative">
      {isEditMode && !isEditing && (
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute right-2 top-2 hover:opacity-100 transition-opacity z-10" 
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}

      {isEditing ? (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="space-y-4">
            <div>
              <Input
                value={editedValues.desc}
                onChange={(e) => setEditedValues(prev => ({ ...prev, desc: e.target.value }))}
                placeholder="Title"
                className="text-lg font-semibold text-blue-800 mb-2"
              />
              <Textarea
                value={editedValues.text}
                onChange={(e) => setEditedValues(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Description"
                className="text-gray-600 mb-2"
              />
            </div>

            <div className="relative pt-1">
              <input
                type="range"
                min={editedValues.range[0]}
                max={editedValues.range[1]}
                step={editedValues.step_size}
                value={getValue}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between items-center mt-2">
                <Input
                  type="number"
                  value={editedValues.range[0]}
                  onChange={(e) => setEditedValues(prev => ({ 
                    ...prev, 
                    range: [Number(e.target.value), prev.range[1]] 
                  }))}
                  className="w-20"
                />
                <span className="text-sm font-medium text-blue-600">
                  {getValue.toFixed(2)}
                </span>
                <Input
                  type="number"
                  value={editedValues.range[1]}
                  onChange={(e) => setEditedValues(prev => ({ 
                    ...prev, 
                    range: [prev.range[0], Number(e.target.value)] 
                  }))}
                  className="w-20"
                />
              </div>
            </div>

            <div>
              <label className="text-sm">Step Size</label>
              <Input
                type="number"
                value={editedValues.step_size}
                onChange={(e) => setEditedValues(prev => ({ 
                  ...prev, 
                  step_size: Number(e.target.value) 
                }))}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSave}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="group">
          <ShowSliderControl control={control} />
        </div>
      )}
    </div>
  );
};