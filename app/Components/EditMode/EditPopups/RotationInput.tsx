'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Vector3 } from 'three';

interface RotationInputProps {
  value: Vector3;
  onChange: (newValue: Vector3) => void;
  size?: number;
}

const RotationInput: React.FC<RotationInputProps> = ({ value, onChange, size = 200 }) => {
  const [angle, setAngle] = useState(0);
  const [inputValue, setInputValue] = useState('0');
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const degrees = ((value.z + Math.PI * 2) % (Math.PI * 2)) * (180 / Math.PI);
    setAngle(degrees);
    setInputValue(degrees.toFixed(2));
  }, [value]);

  const center = size / 2;
  const radius = (size / 2) * 0.8;

  const handleInteraction = (e: React.MouseEvent<SVGSVGElement>) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - center;
      const y = center - (e.clientY - rect.top); // Invert Y-axis
      let newAngle = Math.atan2(y, x) * (180 / Math.PI);
      newAngle = (newAngle + 360) % 360; // Ensure angle is between 0 and 360
      updateAngle(newAngle);
    }
  };

  const updateAngle = (newAngle: number) => {
    setAngle(newAngle);
    setInputValue(newAngle.toFixed(2));
    const radians = newAngle * (Math.PI / 180);
    onChange(new Vector3(value.x, value.y, radians));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const newAngle = parseFloat(newValue);
    if (!isNaN(newAngle)) {
      updateAngle(newAngle % 360);
    }
  };

  const getPointOnCircle = (angle: number) => ({
    x: center + radius * Math.cos(angle * (Math.PI / 180)),
    y: center - radius * Math.sin(angle * (Math.PI / 180)), // Invert Y-axis
  });

  const point = getPointOnCircle(angle);

  return (
    <div>
      <svg
        ref={svgRef}
        width={size}
        height={size}
        onClick={handleInteraction}
        onMouseMove={(e) => e.buttons === 1 && handleInteraction(e)}
      >
        <circle cx={center} cy={center} r={radius} stroke="#999" fill="none" />
        <circle cx={center} cy={center} r={3} fill="#999" />
        <line
          x1={center}
          y1={center}
          x2={point.x}
          y2={point.y}
          stroke="blue"
          strokeWidth={2}
        />
        <circle cx={point.x} cy={point.y} r={5} fill="blue" />
        <text x={5} y={20} fontSize={14}>
          Z: {angle.toFixed(2)}°
        </text>
      </svg>
      <div>
        <label htmlFor="angleInput">Angle (degrees): </label>
        <input
          id="angleInput"
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          step="0.01"
          min="0"
          max="360"
        />
      </div>
    </div>
  );
};

export default RotationInput;