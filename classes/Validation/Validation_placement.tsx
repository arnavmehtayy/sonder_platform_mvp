import Validation from "./Validation";
import { ValidationConstructor } from "./Validation";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Vector2 } from "three";
import { ValidationPlacementInsert, ValidationPlacementSelect } from "@/app/db/schema";
import { useStore } from "@/app/store";
import { geomobj } from "../vizobjects/geomobj";

export interface Validation_placement_constructor extends ValidationConstructor {
  placement_id: number;
  correct_positions: Vector2[];
  error_radius: number;
}

export default class Validation_placement extends Validation {
  placement_id: number;
  correct_positions: Vector2[];
  error_radius: number;

  constructor({
    placement_id,
    correct_positions,
    error_radius = 0.5,
    desc = "validation_placement"
  }: Validation_placement_constructor) {
    super({ is_valid: false, desc: desc });
    this.placement_id = placement_id;
    this.correct_positions = correct_positions;
    this.error_radius = error_radius;
  }

  computeValidity(placement: any): Validation_placement {
    // Get all placed object positions
    const placedPositions = placement.object_ids.map((id: number) => {
      const obj = useStore.getState().vizobjs[id] as geomobj;
      return obj ? new Vector2(obj.position.x, obj.position.y) : null;
    }).filter((pos: Vector2 | null) => pos !== null);

    // Check if we have the correct number of placements
    if (placedPositions.length !== this.correct_positions.length) {
      return this.set_valid(false) as Validation_placement;
    }

    // Check if each placed position matches a correct position within the error radius
    const matchedPositions = new Set();
    for (const placedPos of placedPositions) {
      let foundMatch = false;
      for (let i = 0; i < this.correct_positions.length; i++) {
        if (matchedPositions.has(i)) continue;
        
        const correctPos = this.correct_positions[i];
        const distance = placedPos.distanceTo(correctPos);
        
        if (distance <= this.error_radius) {
          matchedPositions.add(i);
          foundMatch = true;
          break;
        }
      }
      if (!foundMatch) {
        return this.set_valid(false) as Validation_placement;
      }
    }

    return this.set_valid(true) as Validation_placement;
  }

  serialize(): Omit<ValidationPlacementInsert, "stateId"> {
    return {
      desc: this.desc,
      placement_id: this.placement_id,
      correct_positions: this.correct_positions.map(v => ({x: v.x, y: v.y})),
      error_radius: this.error_radius
    };
  }

  static deserialize(data: ValidationPlacementSelect): Validation_placement {
    return new Validation_placement({
      placement_id: data.placement_id,
      correct_positions: data.correct_positions.map(p => new Vector2(p.x, p.y)),
      error_radius: data.error_radius,
      desc: data.desc
    });
  }
}

export interface ValidationPlacementEditorProps {
  onChange: (value: Validation_placement_constructor | undefined) => void;
  placementId: number;
}

export const ValidationPlacementEditor: React.FC<ValidationPlacementEditorProps> = ({
  onChange,
  placementId,
}) => {
  const [addValidation, setAddValidation] = React.useState(false);
  const [validationState, setValidationState] = React.useState<Validation_placement_constructor>({
    placement_id: placementId,
    correct_positions: [],
    error_radius: 0.5,
    desc: "Validation for Placement",
  });

  React.useEffect(() => {
    if (addValidation) {
      onChange(validationState);
    } else {
      onChange(undefined);
    }
  }, [addValidation, validationState, onChange]);

  const handleInputChange = (field: keyof Validation_placement_constructor, value: any) => {
    setValidationState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DialogHeader>
          <DialogTitle>Validate Placement</DialogTitle>
        </DialogHeader>
        <Button
          variant={addValidation ? "default" : "outline"}
          size="sm"
          onClick={() => setAddValidation(!addValidation)}
        >
          {addValidation ? "Remove Validation" : "Add Validation"}
        </Button>
      </div>
      {addValidation && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="validation-desc" className="text-sm font-medium">
              Validation Description
            </Label>
            <Input
              id="validation-desc"
              value={validationState.desc}
              onChange={(e) => handleInputChange("desc", e.target.value)}
              placeholder="Validation for Placement"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="error-radius" className="text-sm font-medium">
              Error Radius
            </Label>
            <Input
              id="error-radius"
              type="number"
              value={validationState.error_radius}
              onChange={(e) => handleInputChange("error_radius", parseFloat(e.target.value))}
              placeholder="0.5"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Correct Positions</Label>
            <PositionEditor
              positions={validationState.correct_positions}
              onChange={(positions) => handleInputChange("correct_positions", positions)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface PositionEditorProps {
  positions: Vector2[];
  onChange: (positions: Vector2[]) => void;
}

function PositionEditor({ positions, onChange }: PositionEditorProps) {
  const addPosition = () => {
    onChange([...positions, new Vector2(0, 0)]);
  };

  const updatePosition = (index: number, axis: 'x' | 'y', value: number) => {
    const newPositions = [...positions];
    newPositions[index][axis] = value;
    onChange(newPositions);
  };

  const removePosition = (index: number) => {
    onChange(positions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {positions.map((pos, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            type="number"
            value={pos.x}
            onChange={(e) => updatePosition(index, 'x', parseFloat(e.target.value))}
            placeholder="X"
            className="w-24"
          />
          <Input
            type="number"
            value={pos.y}
            onChange={(e) => updatePosition(index, 'y', parseFloat(e.target.value))}
            placeholder="Y"
            className="w-24"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removePosition(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={addPosition}
      >
        Add Position
      </Button>
    </div>
  );
}