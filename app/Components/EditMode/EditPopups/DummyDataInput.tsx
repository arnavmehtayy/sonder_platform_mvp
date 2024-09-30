import React from 'react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface DataInputProps {
  value: any;
  onChange: (value: any) => void;
  dataType: string;
}

export function DummyDataInput({ value, onChange, dataType }: DataInputProps) {
  switch (dataType) {
    case "number":
      return (
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "string":
      return (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "boolean":
      return (
        <Checkbox
          checked={value}
          onCheckedChange={(checked) => onChange(checked)}
        />
      );
    case "number[]":
    case "string[]":
      return (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter comma-separated values"
        />
      );
    default:
      return null;
  }
}