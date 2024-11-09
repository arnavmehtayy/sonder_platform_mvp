import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PredefinedGeometry } from '@/classes/vizobjects/geomobj';

interface GeometryInputProps {
  value: PredefinedGeometry;
  onChange: (newValue: PredefinedGeometry) => void;
}

export function GeometryInput({ value, onChange }: GeometryInputProps) {
  const [geometryType, setGeometryType] = React.useState<PredefinedGeometry['type']>(value.type);
  const [params, setParams] = React.useState(value.params);

  React.useEffect(() => {
    if (geometryType !== value.type || JSON.stringify(params) !== JSON.stringify(value.params)) {
      onChange({ type: geometryType, params });
    }
  }, [geometryType, params, onChange, value]);

  const handleParamChange = (paramName: string, newValue: number) => {
    setParams(prevParams => ({
      ...prevParams,
      [paramName]: newValue
    }));
  };

  const renderParamInputs = () => {
    switch (geometryType) {
      case 'circle':
        return (
          <div className="mt-2">
            <Label htmlFor="radius">Radius</Label>
            <Input
              id="radius"
              type="number"
              value={params.radius || 1}
              onChange={(e) => handleParamChange('radius', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        );
      case 'rectangle':
        return (
          <div className="mt-2 space-y-2">
            <div>
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                value={params.width || 1}
                onChange={(e) => handleParamChange('width', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                value={params.height || 1}
                onChange={(e) => handleParamChange('height', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        );
      case 'triangle':
        return (
          <div className="mt-2">
            <Label htmlFor="sideLength">Side Length</Label>
            <Input
              id="sideLength"
              type="number"
              value={params.sideLength || 1}
              onChange={(e) => handleParamChange('sideLength', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        );
      case 'regular-polygon':
        return (
          <div className="mt-2 space-y-2">
            <div>
              <Label htmlFor="radius">Radius</Label>
              <Input
                id="radius"
                type="number"
                value={params.radius || 1}
                onChange={(e) => handleParamChange('radius', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="numSides">Number of Sides</Label>
              <Input
                id="numSides"
                type="number"
                value={params.numSides || 5}
                onChange={(e) => handleParamChange('numSides', parseInt(e.target.value))}
                className="w-full"
                min="3"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Select value={geometryType} onValueChange={(value: PredefinedGeometry['type']) => setGeometryType(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select geometry type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="circle">Circle</SelectItem>
          <SelectItem value="rectangle">Rectangle</SelectItem>
          <SelectItem value="triangle">Triangle</SelectItem>
          <SelectItem value="regular-polygon">Regular Polygon</SelectItem>
        </SelectContent>
      </Select>
      {renderParamInputs()}
    </div>
  );
}