import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Plus, Trash2 } from "lucide-react";
import { MultiChoiceClass, Option } from "../MultiChoiceClass";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/app/store";

interface InlineMultiChoiceEditProps {
  control: MultiChoiceClass;
  onClose: () => void;
}

export const InlineMultiChoiceEdit: React.FC<InlineMultiChoiceEditProps> = ({
  control,
  onClose,
}) => {
  const [editedValues, setEditedValues] = React.useState({
    desc: control.desc,
    text: control.text,
    options: [...control.options],
    isMultiSelect: control.isMultiSelect,
  });

  const handleSave = () => {
    const updatedControl = new MultiChoiceClass({
      id: control.id,
      desc: editedValues.desc,
      text: editedValues.text,
      options: editedValues.options,
      isMultiSelect: editedValues.isMultiSelect,
    });
    useStore.getState().setControl(control.id, updatedControl);
    onClose();
  };

  const addOption = () => {
    const newOption: Option = {
      id: Date.now() % 100000,
      label: `Option ${editedValues.options.length + 1}`,
    };
    setEditedValues((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
  };

  const updateOption = (index: number, newLabel: string) => {
    const newOptions = [...editedValues.options];
    newOptions[index] = { ...newOptions[index], label: newLabel };
    setEditedValues((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const removeOption = (index: number) => {
    setEditedValues((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      {/* Basic Information */}
      <div className="space-y-3">
        <div>
          <Label className="text-xs text-gray-500">Title</Label>
          <Input
            value={editedValues.desc}
            onChange={(e) =>
              setEditedValues((prev) => ({ ...prev, desc: e.target.value }))
            }
            className="text-lg font-semibold text-blue-800"
          />
        </div>

        <div>
          <Label className="text-xs text-gray-500">Description</Label>
          <Textarea
            value={editedValues.text}
            onChange={(e) =>
              setEditedValues((prev) => ({ ...prev, text: e.target.value }))
            }
            className="text-gray-600"
          />
        </div>
      </div>

      {/* Multiple Selection Toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-sm">Allow Multiple Selections</Label>
        <Switch
          checked={editedValues.isMultiSelect}
          onCheckedChange={(checked) =>
            setEditedValues((prev) => ({
              ...prev,
              isMultiSelect: checked,
            }))
          }
        />
      </div>

      {/* Options */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-500">Options</Label>
        {editedValues.options.map((option, index) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Input
              value={option.label}
              onChange={(e) => updateOption(index, e.target.value)}
              className="flex-grow"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeOption(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={addOption}
          className="w-full mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Option
        </Button>
      </div>

      {/* Save/Cancel Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="ghost" size="sm" onClick={onClose}>
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
