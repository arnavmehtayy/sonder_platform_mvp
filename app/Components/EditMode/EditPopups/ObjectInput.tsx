import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ObjectEditorProps {
  object: any;
  onChange: (updatedObject: any) => void;
}

export function ObjectEditor({ object, onChange }: ObjectEditorProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ ...object, [key]: value });
  };

  const renderField = (key: string, value: any) => {
    if (typeof value === 'string' || typeof value === 'number') {
      return (
        <Input
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
          type={typeof value === 'number' ? 'number' : 'text'}
        />
      );
    } else if (Array.isArray(value)) {
      return (
        <div>
          {value.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              <Input
                value={item ?? ''}
                type={typeof item === 'number' ? 'number' : 'text'}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue === "" || (typeof item === 'number' && /^-?\d*\.?\d*$/.test(newValue))) {
                    const newArray = [...value];
                    newArray[index] = newValue === "" ? null : 
                      (typeof item === 'number' ? parseFloat(newValue) : newValue);
                    handleChange(key, newArray);
                  }
                }}
                onBlur={(e) => {
                  const newValue = e.target.value;
                  const newArray = [...value];
                  newArray[index] = newValue === "" ? null : 
                    (typeof item === 'number' ? parseFloat(newValue) : newValue);
                  handleChange(key, newArray);
                }}
                onWheel={(e) => e.currentTarget.blur()}
              />
              <Button
                onClick={() => {
                  const newArray = value.filter((_, i) => i !== index);
                  handleChange(key, newArray);
                }}
                variant="ghost"
                size="icon"
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            onClick={() => handleChange(key, [...value, ''])}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Add Item
          </Button>
        </div>
      );
    } else if (typeof value === 'object' && value !== null) {
      return <ObjectEditor object={value} onChange={(newValue) => handleChange(key, newValue)} />;
    }
    return null;
  };

  return (
    <div>
      {Object.entries(object).map(([key, value]) => (
        <div key={key} className="mb-4">
          <label className="block mb-2">{key}</label>
          {renderField(key, value)}
        </div>
      ))}
    </div>
  );
}