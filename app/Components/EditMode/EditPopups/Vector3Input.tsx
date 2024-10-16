'use client'

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Vector3 } from 'three';

interface Vector3InputProps {
  value: Vector3;
  onChange: (newValue: Vector3) => void;
  size?: number;
  range?: number;
}

export const Vector3Input: React.FC<Vector3InputProps> = ({ value, onChange, size = 200, range = 10 }) => {
  const [localValues, setLocalValues] = useState({
    x: value.x.toString(),
    y: value.y.toString(),
    z: value.z.toString()
  });

  useEffect(() => {
    setLocalValues({
      x: value.x.toString(),
      y: value.y.toString(),
      z: value.z.toString()
    });
  }, [value]);

  const handleChange = (axis: 'x' | 'y' | 'z', newValue: string) => {
    setLocalValues(prev => ({ ...prev, [axis]: newValue }));

    const numValue = newValue === '' ? 0 : parseFloat(newValue);
    if (!isNaN(numValue)) {
      const newVector = new Vector3().copy(value);
      newVector[axis] = numValue;
      onChange(newVector);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-2">
        <Input
          placeholder="X"
          type="text"
          // value={localValues.x}
          onChange={(e) => handleChange('x', e.target.value)}
          onBlur={(e) => {
            const value = e.target.value;
            handleChange('x', value === '' ? '0' : value);
          }}
          onWheel={(e) => e.currentTarget.blur()}
          className="mr-2"
        />
        <Input
          placeholder="Y"
          type="text"
          // value={localValues.y}
          onChange={(e) => handleChange('y', e.target.value)}
          onBlur={(e) => {
            const value = e.target.value;
            handleChange('y', value === '' ? '0' : value);
          }}
          onWheel={(e) => e.currentTarget.blur()}
          className="mr-2"
        />
        <Input
          placeholder="Z"
          type="text"
          // value={localValues.z}
          onChange={(e) => handleChange('z', e.target.value)}
          onBlur={(e) => {
            const value = e.target.value;
            handleChange('z', value === '' ? '0' : value);
          }}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>
    </div>
  );
};