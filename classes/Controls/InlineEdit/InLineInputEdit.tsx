import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { InputNumber } from '../InputNumber';
import { Textarea } from "@/components/ui/textarea";
import { useStore } from '@/app/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { AttributePairsEditor } from '../SliderControlAdv';
import { obj } from '@/classes/vizobjects/obj';

interface InlineInputEditProps {
  control: InputNumber;
  onClose: () => void;
}

export const InlineInputEdit: React.FC<InlineInputEditProps> = ({ control, onClose }) => {
  const [editedValues, setEditedValues] = React.useState({
    desc: control.desc,
    text: control.text,
    placeholder: control.placeholder,
    initial_value: control.initial_value,
    obj_id: control.obj_id,
    attribute_pairs: [...control.attribute_JSON]
  });

  const [showAttributes, setShowAttributes] = React.useState(false);
  const allObjects = useStore(state => state.vizobjs);
  const object = useStore(state => state.vizobjs[editedValues.obj_id]);
  const setAttributeOptions = object?.get_set_att_selector("number") || {};

  const handleSave = () => {
    const updatedControl = new InputNumber({
      id: control.id,
      desc: editedValues.desc,
      text: editedValues.text,
      placeholder: editedValues.placeholder,
      initial_value: editedValues.initial_value,
      obj_id: editedValues.obj_id,
      attribute_pairs: editedValues.attribute_pairs,
      value: control.value || 0
    });
    useStore.getState().setControl(control.id, updatedControl);
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      {/* Basic Information */}
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
          <Textarea
            value={editedValues.text}
            onChange={(e) => setEditedValues(prev => ({ ...prev, text: e.target.value }))}
            className="text-gray-600"
          />
        </div>
      </div>

      {/* <Separator />

      {/* Input Configuration */}
      {/* <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Placeholder Text</Label>
            <Input
              value={editedValues.placeholder}
              onChange={(e) => setEditedValues(prev => ({ 
                ...prev, 
                placeholder: e.target.value 
              }))}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Initial Value</Label>
            <Input
              type="number"
            //   value={editedValues.initial_value}
              onChange={(e) => setEditedValues(prev => ({ 
                ...prev, 
                initial_value: Number(e.target.value) 
              }))}
            />
          </div>
        </div>
      </div> */}

      {/* <Separator /> */}

      {/* Object Control Section */}
      {/* <Collapsible open={showAttributes} onOpenChange={setShowAttributes}>
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
          <div>
            <Label className="text-xs text-gray-500">Control Object</Label>
            <Select
              value={editedValues.obj_id.toString()}
              onValueChange={(value) => setEditedValues(prev => ({ 
                ...prev, 
                obj_id: Number(value),
                attribute_pairs: []
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

          {editedValues.obj_id !== -1 && (
            <AttributePairsEditor
              pairs={editedValues.attribute_pairs}
              onChange={(pairs) => setEditedValues(prev => ({ ...prev, attribute_pairs: pairs }))}
              objectId={editedValues.obj_id}
            />
          )}
        </CollapsibleContent>
      </Collapsible> */}

      {/* Save/Cancel Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
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