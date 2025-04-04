'use client'

import React from "react";
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

import { ScrollArea } from "@/components/ui/scroll-area";

import Vector2Input from "./PositionInput";
import RotationInput from "./RotationInput";
import { Vector2, Vector3 } from "three";
import { Textarea } from "@/components/ui/textarea";
import { MCQOptionsInput } from "./MCQPopup";
import { X } from "lucide-react";
import {SelectVizObject, SelectVizObjectList} from "./SelectVizObjsPopup";
import {Vector3Input} from "./Vector3Input";
import { MultiChoiceEditor } from "@/classes/Validation/ValidationMultiChoice";
import { Label } from "@/components/ui/label";
import { PredefinedGeometry } from "@/classes/vizobjects/geomobj";
import { GeometryInput } from "./GeometryInput";


/*
 * This component is a generic popup that allows the user to edit an object.
    * It takes a list of fields that will be displayed in the popup and the object

*/
export interface PopupQuestionProps<T, option_T> {
  key?: keyof T; // Make key optional
  label: string;
  type:
    | "text"
    | "number"
    | "checkbox"
    | "color"
    | "position"
    | "select"
    | "rotation"
    | "textarea"
    | "title"
    | "addoptions"
    | "arraynum"
    | "vizObjSelect"
    | "vizObjSelectList"
    | "custom"
    | "vector3"
    | "validation"
    | "geometry";
  options?: { label: string; value: option_T }[];
  length_of_array?: number;
  showIf?: (obj: T) => boolean;
  render?: (value: any, onChange: (newValue: any) => void) => React.ReactNode;
}

export interface EditableObjectPopupProps<T> {
  isOpen: boolean; // Whether the popup is open
  onClose: () => void; // Function to cleanup and close the popup
  object: T; // The initial object that will be displayed and that will be edited by user
  set_object: React.Dispatch<React.SetStateAction<T>>; // Function to update the object when user changes the value
  onSave: (updatedObject: T) => void; // Function to save the edited object when user clicks save
  title: string;
  fields: Array<PopupQuestionProps<T, any>>; // The fields that will be displayed in the popup
  additionalContent?: React.ReactNode;
}

export function EditableObjectPopup<T>({
  isOpen,
  onClose,
  object,
  set_object,
  onSave,
  title,
  fields,
  additionalContent
}: EditableObjectPopupProps<T>) {
  const [editedObject, setEditedObject] = [object, set_object];

  const handleChange = (key: keyof T, value: any) => {
    setEditedObject((prev) => ({ ...prev, [key]: value }));
  };

  const handleChangeInt = (key: keyof T, value: string | null) => {
    if (value === null) {
      setEditedObject((prev) => ({ ...prev, [key]: null }));
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setEditedObject((prev) => ({ ...prev, [key]: numValue }));
      }
    }
  };

  const handleSave = () => {
    onSave(editedObject);
    onClose();
  };

  const renderField = (field: EditableObjectPopupProps<T>["fields"][0]) => {
    if (field.showIf && !field.showIf(editedObject)) {
      return null;
    }

    switch (field.type) {
      case "custom":
        if (field.render) {
          return (
            <div className="mb-4">
              <label className="block mb-2">{field.label}</label>
              {field.render(
                field.key ? editedObject[field.key] : undefined,
                (newValue) => field.key ? handleChange(field.key, newValue) : undefined
              )}
            </div>
          );
        }
        return null;
      // case "validation":
      //   return field.render ? field.render(editedObject[field.key], (newValue) => handleChange(field.key, newValue)) : null;

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.key as string}
              checked={editedObject[field.key!] as boolean}
              onChange={(e) => handleChange(field.key!, e.target.checked)}
              className="h-5 w-5 mr-2"
            />
            <label htmlFor={field.key as string}>{field.label}</label>
          </div>
        );

      case "title":
        return (
          <div className="mb-4">
            <Input
              onChange={(e) => handleChange(field.key!, e.target.value)}
              placeholder={field.label}
              className="text-lg font-semibold text-blue-800 mb-2"
            />
          </div>
        );
        case "vector3":
          return (
            <div className="mb-4">
              <label className="block mb-2">{field.label}</label>
              <Vector3Input
                value={editedObject[field.key!] as Vector3}
                onChange={(newValue: Vector3) =>
                  handleChange(field.key!, newValue)
                }
                size={200}
              />
            </div>
          );
      case "textarea":
        return (
          <div className="mb-4">
            <Textarea
              onChange={(e) => handleChange(field.key!, e.target.value)}
              placeholder="Question Description"
              className="text-gray-600 mb-2"
            />
          </div>
        );
      case "addoptions":
        return (
          <div className="mb-4">
            <label className="block mb-2">{field.label}</label>
            <MCQOptionsInput
              options={
                editedObject[field.key!] as { id: string; label: string }[]
              }
              onChange={(newOptions) => handleChange(field.key!, newOptions)}
            />
          </div>
        );

      case "rotation":
        return (
          <div className="mb-4">
            <label className="block mb-2">{field.label}</label>
            <RotationInput
              value={editedObject[field.key!] as Vector3}
              onChange={(newValue: Vector3) =>
                handleChange(field.key!, newValue)
              }
              size={200}
            />
          </div>
        );
      case "position":
        return (
          <div className="mb-4">
            <label className="block mb-2">{field.label}</label>
            <Vector2Input
              value={editedObject[field.key!] as Vector2}
              onChange={(newValue: Vector2) =>
                handleChange(field.key!, newValue)
              }
              size={200}
              range={10}
            />
          </div>
        );
      
      case "vizObjSelect":
        return (
        <SelectVizObject handleChange={(id) => handleChange(field.key!, id)} />
      );

      case "vizObjSelectList":
        return (
        <SelectVizObjectList handleChange={(selectedObjects) => handleChange(field.key!, selectedObjects)} />
      );
      case "select":
        
        // console.log(field.options, editedObject[field.key])
        return (
          <div className="mb-4">
            <label className="block mb-2">{field.label}</label>
            <Select
              value={JSON.stringify(editedObject[field.key!])}
              onValueChange={(value) => handleChange(field.key!, JSON.parse(value))}
            >
              <SelectTrigger>
                <SelectValue>
                  {field.options?.find(option => JSON.stringify(option.value) === JSON.stringify(editedObject[field.key!]))?.label || "Select an option"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, index) => (
                  <SelectItem
                    key={`${JSON.stringify(option.value)}-${index}`}
                    value={JSON.stringify(option.value)}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case "text":
        return (
          <div className="mb-4">
            <label className="block mb-2">{field.label}</label>
            <Input
              key={field.key as string}
              id={field.key as string}
              placeholder={field.label}
              type={field.type}
              value={editedObject[field.key!] as string}
              onChange={(e) => handleChange(field.key!, e.target.value)}
              className="col-span-3"
            />
          </div>
        );
      case "color":
        return (
          <div className="mb-4">
            <label className="block mb-2">{field.label}</label>
            <Input
              id={field.key as string}
              type={field.type}
              value={editedObject[field.key!] as number}
              onChange={(e) => handleChange(field.key!, e.target.value)}
              className="col-span-3"
            />
          </div>
        );
      case "arraynum":
        return (
          <div className="mb-4">
            <label className="block mb-2">{field.label}</label>
            {(editedObject[field.key!] as any[]).map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <Input
                  placeholder={field.label}
                  id={`${field.key as string}-${index}`}
                  type="number"
                  // value={item ?? ""} // Use empty string if item is null or undefined
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                      const newArray = [...(editedObject[field.key!] as any[])];
                      newArray[index] = value === "" ? null : parseFloat(value);
                      handleChange(field.key!, newArray);
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    const newArray = [...(editedObject[field.key!] as any[])];
                    newArray[index] = value === "" ? null : parseFloat(value);
                    handleChange(field.key!, newArray);
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                />

                {field.length_of_array === -1 && (
                  <Button
                    onClick={() => {
                      const newArray = (
                        editedObject[field.key!] as any[]
                      ).filter((_, i) => i !== index);
                      handleChange(field.key!, newArray);
                    }}
                    variant="ghost"
                    size="icon"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            {field.length_of_array === -1 && (
              <Button
                onClick={() => {
                  const newArray = [
                    ...(editedObject[field.key!] as any[]),
                    null,
                  ];
                  handleChange(field.key!, newArray);
                }}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Add Item
              </Button>
            )}
          </div>
        );

      case "number":
        return (
          <div className="mb-4">
            <label className="block mb-2">{field.label}</label>
            <Input
              placeholder={field.label}
              id={field.key as string}
              type={field.type}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                  handleChangeInt(field.key!, value === "" ? null : value);
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value !== "") {
                  handleChangeInt(field.key!, value);
                }
              }}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
        );

      case "geometry":
        return (
          <div className="mb-4">
            <label className="block mb-2">{field.label}</label>
            <GeometryInput
              value={editedObject[field.key!] as PredefinedGeometry}
              onChange={(newValue) => handleChange(field.key!, newValue)}
            />
          </div>
        );

      default:
        return (
          <div className="mb-4">
            <label htmlFor={field.key as string} className="block mb-2">
              {field.label}
            </label>
            <Input
              placeholder={field.label}
              id={field.key as string}
              type={field.type}
              value={editedObject[field.key!] as string | number}
              onChange={(e) => handleChange(field.key!, e.target.value)}
            />
          </div>
        );
    }
  };

  const dialogDescriptionId = `dialog-description-${React.useId()}`;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div id={dialogDescriptionId} className="sr-only">
          Edit properties for {title}
        </div>
        <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
          <div className="space-y-4 py-4 px-2 flex flex-col ">
            {fields.map((field, index) => (
              <React.Fragment key={`${field.key as string}-${index}`}>
                {renderField(field)}
                
              </React.Fragment>
            ))}
            {additionalContent && (
              <div className="pt-6 border-t border-gray-200">
                {additionalContent}
              </div>)}
          </div>
          
        </ScrollArea>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


