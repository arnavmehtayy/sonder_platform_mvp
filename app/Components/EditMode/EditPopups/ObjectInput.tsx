import React from 'react';
import { Input } from "@/components/ui/input";

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
                value={item}
                onChange={(e) => {
                  const newArray = [...value];
                  newArray[index] = e.target.value;
                  handleChange(key, newArray);
                }}
              />
              <button
                onClick={() => {
                  const newArray = value.filter((_, i) => i !== index);
                  handleChange(key, newArray);
                }}
                className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => handleChange(key, [...value, ''])}
            className="px-2 py-1 bg-green-500 text-white rounded"
          >
            Add Item
          </button>
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