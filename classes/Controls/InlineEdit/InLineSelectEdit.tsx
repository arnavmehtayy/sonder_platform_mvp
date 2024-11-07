import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from 'lucide-react';
import { SelectControl } from '../SelectControl';
import { Textarea } from "@/components/ui/textarea";
import { useStore } from '@/app/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InlineSelectEditProps {
  control: SelectControl;
  onClose: () => void;
}

export const InlineSelectEdit: React.FC<InlineSelectEditProps> = ({ control, onClose }) => {
  const [editedValues, setEditedValues] = React.useState({
    desc: control.desc,
    text: control.text,
    selectable: [...control.selectable],
    capacity: control.capacity,
    selected: [...control.selected]
  });

  const allObjects = useStore(state => state.vizobjs);

  const handleSave = () => {
    const updatedControl = new SelectControl({
      id: control.id,
      desc: editedValues.desc,
      text: editedValues.text,
      selectable: editedValues.selectable,
      capacity: editedValues.capacity,
      selected: editedValues.selected,
      isActive: control.isActive
    });
    useStore.getState().setControl(control.id, updatedControl);
    onClose();
  };

  const handleAddObject = (selectedId: string) => {
    const id = Number(selectedId);
    if (!editedValues.selectable.includes(id)) {
      setEditedValues(prev => ({
        ...prev,
        selectable: [...prev.selectable, id]
      }));
    }
  };

  const handleRemoveObject = (id: number) => {
    setEditedValues(prev => ({
      ...prev,
      selectable: prev.selectable.filter(objId => objId !== id),
      selected: prev.selected.filter(objId => objId !== id)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
      <div className="space-y-2">
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

        <div>
          <Label className="text-xs text-gray-500">Selection Capacity</Label>
          <Input
            type="number"
            // value={editedValues.capacity}
            onChange={(e) => setEditedValues(prev => ({ 
              ...prev, 
              capacity: Math.max(1, parseInt(e.target.value) || 1)
            }))}
            min="1"
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Choose Selectable Objects</Label>
        <Select onValueChange={handleAddObject}>
          <SelectTrigger>
            <SelectValue placeholder="Select an object" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(allObjects).map((obj) => (
              <SelectItem key={obj.id} value={obj.id.toString()}>
                {obj.name || `Object ${obj.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {editedValues.selectable.map((id) => (
            <div 
              key={id} 
              className="bg-blue-600 rounded-full px-3 py-1 flex items-center"
            >
              <span className="text-white text-sm font-medium truncate mr-2">
                {allObjects[id]?.name || `Object ${id}`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveObject(id)}
                className="text-white hover:text-red-500 p-0 h-auto"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
        <Button variant="default" size="sm" onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
          <Check className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  );
};