import React from 'react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface DataInputProps {
  value: any;
  onChange: (value: any) => void;
  dataType: string;
}

export function DummyDataInput({ value, onChange, dataType }: DataInputProps) {
  const handleChange = (newValue: any) => {
    if (newValue === null || newValue === undefined) {
      // Handle null or undefined values
      onChange('');
    } else {
      onChange(newValue);
    }
  };

  switch (dataType) {
    case "number":
      return (
        <Input
          type="number"
          value={value ?? ''}
          onChange={(e) => handleChange(e.target.value)}
        />
      );
    case "string":
      return (
        <Input
          type="text"
          value={value ?? ''}
          onChange={(e) => handleChange(e.target.value)}
        />
      );
    case "boolean":
      return (
        <Checkbox
          checked={!!value}
          onCheckedChange={(checked) => handleChange(checked)}
        />
      );
    // case "number[]":
    // case "string[]":
    //   return (
    //     <Input
    //       type="text"
    //       value={Array.isArray(value) ? value.join(',') : ''}
    //       onChange={(e) => handleChange(e.target.value.split(','))}
    //       placeholder="Enter comma-separated values"
    //     />
    //   );
    default:
      return null;
  }
}