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

export interface EditableObjectPopupProps<T> {
  isOpen: boolean;
  onClose: () => void;
  object: T;
  onSave: (updatedObject: T) => void;
  title: string;
  fields: Array<{
    key: keyof T;
    label: string;
    type: 'text' | 'number' | 'checkbox' | 'color';
  }>;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.key as string} className="grid grid-cols-4 items-center gap-4">
              <label htmlFor={field.key as string} className="text-right">
                {field.label}
              </label>
              {field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  id={field.key as string}
                  checked={editedObject[field.key] as boolean}
                  onChange={(e) => handleChange(field.key, e.target.checked)}
                  className="col-span-3"
                />
              ) : (
                <Input
                  id={field.key as string}
                  type={field.type}
                  value={editedObject[field.key] as string | number}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="col-span-3"
                />
              )}
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