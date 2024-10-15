'use client'

import React, { useState, useEffect } from 'react';
import { useStore, getObjectsSelector } from "@/app/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { obj } from '@/classes/vizobjects/obj';
import { X } from 'react-feather';

export function SelectVizObject({ handleChange }: { handleChange: (id: number) => void }) {
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

interface VizObject {
  id: number;
  name: string;
}

export function SelectVizObjectList({handleChange}: {handleChange: (objects: number[]) => void}) {
  const [availableVizObjects, setAvailableVizObjects] = useState(useStore(getObjectsSelector)); // gets all the possible objects to select from
  const [selectedVizObjects, setSelectedVizObjects] = useState<obj[]>([]);
  const [listLength, setListLength] = useState(5);

  const generateAvailableVizObjects = () => {
    setSelectedVizObjects([]);
  };

  const handleSelectVizObject = (selectedId: string) => {
    const selectedObject = availableVizObjects.find(obj => obj.id.toString() === selectedId);
    if (selectedObject && !selectedVizObjects.some(obj => obj.id === selectedObject.id)) {
      setSelectedVizObjects([...selectedVizObjects, selectedObject]);
      handleChange([...selectedVizObjects, selectedObject].map(obj => obj.id));
    }
  };

  const handleRemoveVizObject = (id: number) => {
    setSelectedVizObjects(selectedVizObjects.filter(obj => obj.id !== id));
  };

  // console.log("render")
  return (
    
      
        <div className="space-y-4"> 
        <label className="block mb-2">Choose Selectable Objects</label>
          <Select onValueChange={handleSelectVizObject}>
            <SelectTrigger>
              <SelectValue placeholder="Select a VizObject" />
            </SelectTrigger>
            <SelectContent>
              {availableVizObjects.map((obj) => (
                <SelectItem key={obj.id} value={obj.id.toString()}>
                  {obj.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div>
            {/* <h3 className="font-semibold mb-2">Selected VizObjects:</h3> */}
            <ul className="space-y-2">
              {selectedVizObjects.map((obj) => (
                <li 
                key={obj.id} 
                className="bg-blue-600 border border-gray-200 rounded-lg shadow-sm p-3 mb-2 flex justify-between items-center transition-colors duration-200 ease-in-out"
              >
                <span className="text-white font-medium truncate flex-grow mr-2">{obj.name}</span>
                <Button
                  className="text-white hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200 ease-in-out"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveVizObject(obj.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
              ))}
            </ul>
          </div>
        </div>

  );
};
