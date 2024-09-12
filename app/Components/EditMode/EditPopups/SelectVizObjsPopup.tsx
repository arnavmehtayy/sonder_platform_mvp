import React from 'react';
import { useStore, getObjectsSelector } from "@/app/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SelectVizObjectComponent({ handleChange }: { handleChange: (id: number) => void }) {
  const objects = useStore(getObjectsSelector);

  return (
    <div className="mb-4">
      <label className="block mb-2">Select an Object</label>
      <Select onValueChange={(value) => handleChange(parseInt(value))}>
        <SelectTrigger>
          <SelectValue placeholder="Select an object" />
        </SelectTrigger>
        <SelectContent>
          {objects.map((obj, index) => (
            <SelectItem
              key={`${obj.id}-${index}`}
              value={obj.id.toString()}
            >
              {obj.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}