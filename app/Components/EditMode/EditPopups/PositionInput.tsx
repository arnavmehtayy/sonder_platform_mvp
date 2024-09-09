import React, { useState, useEffect, useRef } from 'react';
import { Vector2 } from 'three';

interface Vector2InputProps {
  value: Vector2;
  onChange: (newValue: Vector2) => void;
  size?: number;
  range?: number;
}

const Vector2Input: React.FC<Vector2InputProps> = ({ value, onChange, size = 200, range = 10 }) => {
  const [position, setPosition] = useState<Vector2>(new Vector2(0, 0));
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setPosition(new Vector2(
      (value.x / range) * (size / 2) + size / 2,
      size / 2 - (value.y / range) * (size / 2)
    ));
  }, [value, size, range]);

  const updateValue = (x: number, y: number) => {
    const newValue = new Vector2(
      parseFloat(((x - size / 2) / (size / 2) * range).toFixed(2)),
      parseFloat(((size / 2 - y) / (size / 2) * range).toFixed(2))
    );
    onChange(newValue);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition(new Vector2(x, y));
    updateValue(x, y);
  };

  const handleKeyDown = (axis: 'x' | 'y', e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const step = e.key === 'ArrowUp' ? 0.01 : -0.01;
      const currentValue = axis === 'x' ? value.x : value.y;
      const newValue = Math.max(-range, Math.min(range, currentValue + step));
      onChange(new Vector2(
        axis === 'x' ? newValue : value.x,
        axis === 'y' ? newValue : value.y
      ));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg 
        ref={svgRef}
        width={size} 
        height={size} 
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      >
        <rect width={size} height={size} fill="#f0f0f0" />
        <line x1={size / 2} y1={0} x2={size / 2} y2={size} stroke="#999" strokeWidth={1} />
        <line x1={0} y1={size / 2} x2={size} y2={size / 2} stroke="#999" strokeWidth={1} />
        <circle
          cx={position.x}
          cy={position.y}
          r={5}
          fill="blue"
        />
        <text x={5} y={20} fontSize={14}>
          ({value.x.toFixed(2)}, {value.y.toFixed(2)})
        </text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', alignItems: 'center' }}>
        <label style={{ marginRight: '5px' }}>X:</label>
        <div 
          tabIndex={0} 
          onKeyDown={(e) => handleKeyDown('x', e)} 
          style={inputStyle}
        >
          {value.x.toFixed(2)}
        </div>
        <label style={{ margin: '0 5px 0 10px' }}>Y:</label>
        <div 
          tabIndex={0} 
          onKeyDown={(e) => handleKeyDown('y', e)} 
          style={inputStyle}
        >
          {value.y.toFixed(2)}
        </div>
      </div>
      <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
        Click and drag on the grid or use arrow keys to adjust values
      </div>
    </div>
  );
};

const inputStyle = {
  width: '60px',
  padding: '5px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  textAlign: 'center' as const,
  cursor: 'default',
  userSelect: 'none' as const,
};

export default Vector2Input;