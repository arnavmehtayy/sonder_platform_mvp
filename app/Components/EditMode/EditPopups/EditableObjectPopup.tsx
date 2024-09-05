import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from '@radix-ui/react-switch';

/*
 * This component is a generic popup that allows the user to edit an object.
    * It takes a list of fields that will be displayed in the popup and the object

*/
export interface EditableObjectPopupProps<T> {
  isOpen: boolean; // Whether the popup is open
  onClose: () => void; // Function to cleanup and close the popup
  object: T; // The initial object that will be displayed and that will be edited by user
  onSave: (updatedObject: T) => void; // Function to save the edited object when user clicks save
  title: string;
  fields: Array<{ 
    key: keyof T; // The key of the object that will be edited
    label: string;
    type: 'text' | 'number' | 'checkbox' | 'color' | 'vector2' | 'select';
    options?: string[]; // For select type
  }>; // The fields that will be displayed in the popup
}

export function EditableObjectPopup<T>({
  isOpen,
  onClose,
  object,
  onSave,
  title,
  fields,
}: EditableObjectPopupProps<T>) {
  const [editedObject, setEditedObject] = React.useState<T>({...object});

  const handleChange = (key: keyof T, value: any) => {
    setEditedObject(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(editedObject);
    onClose();
  };

  const renderField = (field: EditableObjectPopupProps<T>['fields'][0]) => {
    switch (field.type) {
      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={field.key as string}
            checked={editedObject[field.key] as boolean}
            onChange={(e) => handleChange(field.key, e.target.checked)}
            className="col-span-3 h-5 w-5"
          />
        );
      case 'vector2':
        return (
          <div className="col-span-3 grid grid-cols-2 gap-2">
            <Input
              type="number"
              value={(editedObject[field.key] as {x: number, y: number}).x}
              onChange={(e) => handleChange(field.key, {...editedObject[field.key] as object, x: parseFloat(e.target.value)})}
              placeholder="X"
            />
            <Input
              type="number"
              value={(editedObject[field.key] as {x: number, y: number}).y}
              onChange={(e) => handleChange(field.key, {...editedObject[field.key] as object, y: parseFloat(e.target.value)})}
              placeholder="Y"
            />
          </div>
        );
      case 'select':
        return (
          <Select
            value={editedObject[field.key] as string}
            onValueChange={(value) => handleChange(field.key, value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            id={field.key as string}
            type={field.type}
            value={editedObject[field.key] as string | number}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="col-span-3"
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.key as string} className="grid grid-cols-4 items-center gap-4">
              <label htmlFor={field.key as string} className="text-right font-medium">
                {field.label}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}