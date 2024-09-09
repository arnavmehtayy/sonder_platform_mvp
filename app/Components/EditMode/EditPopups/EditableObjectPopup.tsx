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

import Vector2Input from './PositionInput';
import RotationInput from './RotationInput';
import { Vector2, Vector3 } from 'three';

/*
 * This component is a generic popup that allows the user to edit an object.
    * It takes a list of fields that will be displayed in the popup and the object

*/
export interface PopupQuestionProps<T, option_T> {
    key: keyof T; // The key of the object that will be edited
    label: string;
    type: 'text' | 'number' | 'checkbox' | 'color' | 'position' | 'select' | "rotation";
    options?: {label: string, value: option_T}[]; // For select type
  
} // option_T is the type of the options that will be displayed in the select dropdown

export interface EditableObjectPopupProps<T> {
  isOpen: boolean; // Whether the popup is open
  onClose: () => void; // Function to cleanup and close the popup
  object: T; // The initial object that will be displayed and that will be edited by user
  onSave: (updatedObject: T) => void; // Function to save the edited object when user clicks save
  title: string;
  fields: Array<PopupQuestionProps<T, any>>; // The fields that will be displayed in the popup
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
      case 'rotation':
        return (
          <div key={field.key as string} className="col-span-3">
            <RotationInput
            key={field.key as string}
              value={editedObject[field.key] as Vector3}
              onChange={(newValue: Vector3) => handleChange(field.key, newValue)}
              size={200}
            />
          </div>
        );
      case 'position':
        // return (
        //   <div className="col-span-3 grid grid-cols-2 gap-2">
        //     <Input
        //       type="number"
        //       value={(editedObject[field.key] as {x: number, y: number}).x}
        //       onChange={(e) => handleChange(field.key, {...editedObject[field.key] as object, x: parseFloat(e.target.value)})}
        //       placeholder="X"
        //     />
        //     <Input
        //       type="number"
        //       value={(editedObject[field.key] as {x: number, y: number}).y}
        //       onChange={(e) => handleChange(field.key, {...editedObject[field.key] as object, y: parseFloat(e.target.value)})}
        //       placeholder="Y"
        //     />
        //   </div>
        // );
        return (
          <div className="col-span-3">
            <Vector2Input
              value={editedObject[field.key] as Vector2}
              onChange={(newValue: Vector2) => handleChange(field.key, newValue)}
              size={200}
              range={10}
            />
          </div>)
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
              {field.options?.map((option, index) => (
                <SelectItem key={`${option.value}-${index}`} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'text':
        return (
          <Input
            key={field.key as string}
            id={field.key as string}
            type={field.type}
            value={editedObject[field.key] as string}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="col-span-3"
          />
        );
      case 'color':
        return (
          <Input
            id={field.key as string}
            type={field.type}
            value={editedObject[field.key] as string | number}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="col-span-3"
          />
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

  const dialogDescriptionId = `dialog-description-${React.useId()}`;;
    return (
      <Dialog key={`dialog-${React.useId()}`} open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[425px]" aria-describedby={dialogDescriptionId}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div id={dialogDescriptionId} className="sr-only">
              Edit properties for {title}
            </div>
            <div className="grid gap-4 py-4">
              {fields.map((field, index) => (
                <div key={`${field.key as string}-${index}`} className="grid grid-cols-4 items-center gap-4">
                    {field.label}
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