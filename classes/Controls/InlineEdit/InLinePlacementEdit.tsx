import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import Placement from '@/classes/Placement';
import { Textarea } from "@/components/ui/textarea";
import { useStore } from '@/app/store';
import { Vector2 } from 'three';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { PredefinedGeometry } from '@/classes/vizobjects/geomobj';
import { GeometryInput } from '@/app/Components/EditMode/EditPopups/GeometryInput';

interface InlinePlacementEditProps {
  placement: Placement;
  onClose: () => void;
}

export const InlinePlacementEdit: React.FC<InlinePlacementEditProps> = ({ placement, onClose }) => {
  const [editedValues, setEditedValues] = React.useState({
    desc: placement.desc,
    text: placement.text,
    color: placement.color,
    max_placements: placement.max_placements,
    gridVectors: [...placement.gridVectors],
    geometry_json: placement.geom_json,
  });

  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleSave = () => {
    const updatedPlacement = new Placement({
      id: placement.id,
      object_ids: placement.object_ids,
      desc: editedValues.desc,
      text: editedValues.text,
      color: editedValues.color,
      max_placements: editedValues.max_placements,
      gridVectors: editedValues.gridVectors,
      geometry_json: editedValues.geometry_json,
      isClickable: placement.isClickable
    });
    
    // Force geometry update
    updatedPlacement.updateGeometry(editedValues.geometry_json);
    useStore.getState().setPlacement(placement.id, updatedPlacement);
    onClose();
  };

  const handleAddVector = () => {
    setEditedValues(prev => ({
      ...prev,
      gridVectors: [...prev.gridVectors, new Vector2(0, 0)]
    }));
  };

  const handleRemoveVector = (index: number) => {
    setEditedValues(prev => ({
      ...prev,
      gridVectors: prev.gridVectors.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      {/* Basic Information */}
      <div className="space-y-3">
        <div>
          <Label className="text-xs text-gray-500">Title</Label>
          <Input
            value={editedValues.desc}
            onChange={(e) => setEditedValues(prev => ({ ...prev, desc: e.target.value }))}
            className="text-lg font-semibold text-blue-800"
          />
        </div>
        
        <div>
          <Label className="text-xs text-gray-500">Description</Label>
          <Textarea
            value={editedValues.text}
            onChange={(e) => setEditedValues(prev => ({ ...prev, text: e.target.value }))}
            className="text-gray-600"
          />
        </div>
      </div>

      <Separator />

      {/* Placement Configuration */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Color</Label>
            <Input
              type="color"
              value={editedValues.color}
              onChange={(e) => setEditedValues(prev => ({ 
                ...prev, 
                color: e.target.value 
              }))}
              className="h-10"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Max Placements</Label>
            <Input
              type="number"
              value={editedValues.max_placements}
              onChange={(e) => setEditedValues(prev => ({ 
                ...prev, 
                max_placements: parseInt(e.target.value) || 1
              }))}
              min="1"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Grid Vectors */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex justify-between items-center"
          >
            Advanced Settings
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          <div>
            <Label className="text-xs text-gray-500">Placement Positions</Label>
            {editedValues.gridVectors.map((vector, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  type="number"
                  value={vector.x}
                  onChange={(e) => {
                    const newVectors = [...editedValues.gridVectors];
                    newVectors[index].x = parseFloat(e.target.value) || 0;
                    setEditedValues(prev => ({ ...prev, gridVectors: newVectors }));
                  }}
                  placeholder="X"
                  className="w-24"
                />
                <Input
                  type="number"
                  value={vector.y}
                  onChange={(e) => {
                    const newVectors = [...editedValues.gridVectors];
                    newVectors[index].y = parseFloat(e.target.value) || 0;
                    setEditedValues(prev => ({ ...prev, gridVectors: newVectors }));
                  }}
                  placeholder="Y"
                  className="w-24"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveVector(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddVector}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Position
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="space-y-2">
        <Label className="text-xs text-gray-500">Geometry Type</Label>
        <GeometryInput
          value={editedValues.geometry_json}
          onChange={(newGeometry) => setEditedValues(prev => ({ 
            ...prev, 
            geometry_json: newGeometry 
          }))}
        />
      </div>

      {/* Save/Cancel Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button 
          variant="default"
          size="sm"
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Check className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  );
}; 