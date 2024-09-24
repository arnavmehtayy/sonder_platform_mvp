
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
    <div style={{ width: size, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {(['x', 'y', 'z'] as const).map((axis) => (
        <div key={axis} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label>{axis.toUpperCase()}:</label>
          <Input
            type="number"
            value={localValues[axis]}
            onChange={(e) => handleChange(axis, e.target.value)}
            min={-range}
            max={range}
            step="0.1"
          />
        </div>
      ))}
    </div>
  );
};