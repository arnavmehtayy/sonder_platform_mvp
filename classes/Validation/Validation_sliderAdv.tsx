import Validation from "./Validation";
import { obj } from "../vizobjects/obj";
import { relation } from "./Validation_obj";
import { ValidationConstructor } from "./Validation";
import { SliderControlAdvanced } from "../Controls/SliderControlAdv";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface Validation_sliderAdv_constructor extends ValidationConstructor {
  control_id: number;
  target_value: number;
  error: number;
  relation: relation;
}

export default class Validation_sliderAdv extends Validation {
  control_id: number;
  target_value: number;
  error: number;
  relation: relation;

  constructor({
    control_id,
    target_value,
    error,
    relation,
    desc = "validation_sliderAdv",
  }: Validation_sliderAdv_constructor) {
    super({ is_valid: false, desc: desc });
    this.control_id = control_id;
    this.target_value = target_value;
    this.error = error;
    this.relation = relation;
  }

  computeValidity(control: SliderControlAdvanced<obj>): Validation_sliderAdv {
    const value = control.localValue;
    // console.log("VALUE", value, this.target_value, this.relation)
    switch (this.relation) {
      case ">":
        if (value > this.target_value - this.error) {
          return this.set_valid(true) as Validation_sliderAdv;
        }
        break;
      case "<":
        if (value < this.target_value + this.error) {
          return this.set_valid(true) as Validation_sliderAdv;
        }
        break;
      case ">=":
        if (value >= this.target_value - this.error) {
          return this.set_valid(true) as Validation_sliderAdv;
        }
        break;
      case "<=":
        if (value <= this.target_value + this.error) {
          return this.set_valid(true) as Validation_sliderAdv;
        }
        break;
      case "!=":
        if (Math.abs(value - this.target_value) > this.error) {
          return this.set_valid(true) as Validation_sliderAdv;
        }
        break;
      case "==":
        if (Math.abs(value - this.target_value) <= this.error) {
          return this.set_valid(true) as Validation_sliderAdv;
        }
        break;
    }
    return this.set_valid(false) as Validation_sliderAdv;
  }

  dataBaseSave(): Validation_sliderAdv_constructor  {
    return {
      is_valid: this.is_valid,
      desc: this.desc,
      control_id: this.control_id,
      target_value: this.target_value,
      error: this.error,
      relation: this.relation,
      type: "V_slider"
    };
  }
}

export interface ValidationSliderAdvEditorProps {
  onChange: (value: Validation_sliderAdv | undefined) => void;
  controlId: number;
}

export const ValidationSliderAdvEditor: React.FC<ValidationSliderAdvEditorProps> = ({
  onChange,
  controlId,
}) => {
  const [validationState, setValidationState] = React.useState<Validation_sliderAdv_constructor | null>(null);

  const handleAddRemoveValidation = () => {
    if (validationState) {
      setValidationState(null);
      onChange(undefined);
    } else {
      const newValidationState: Validation_sliderAdv_constructor = {
        control_id: controlId,
        target_value: 0,
        error: 0.1,
        relation: "==",
        desc: `Validation for Advanced Slider Control`,
      };
      setValidationState(newValidationState);
      onChange(new Validation_sliderAdv(newValidationState));
    }
  };

  const handleInputChange = (field: keyof Validation_sliderAdv_constructor, value: any) => {
    if (validationState) {
      const newState = { ...validationState, [field]: value };
      setValidationState(newState);
      onChange(new Validation_sliderAdv(newState));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DialogHeader>
          <DialogTitle>Validate Slider</DialogTitle>
        </DialogHeader>
        <Button
          variant={validationState ? "default" : "outline"}
          size="sm"
          onClick={handleAddRemoveValidation}
        >
          {validationState ? "Remove Validation" : "Add Validation"}
        </Button>
      </div>
      {validationState && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="validation-desc" className="text-sm font-medium">
              Validation Description
            </Label>
            <Input
              id="validation-desc"
              value={validationState.desc}
              onChange={(e) => handleInputChange("desc", e.target.value)}
              placeholder="Validation for Advanced Slider Control"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validation-target" className="text-sm font-medium">
              Target Value
            </Label>
            <Input
              placeholder="Target value"
              id="validation-target"
              type="number"
              value={validationState.target_value ?? ""}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue === "" || /^-?\d*\.?\d*$/.test(newValue)) {
                  handleInputChange("target_value", newValue === "" ? null : parseFloat(newValue));
                }
              }}
              onBlur={(e) => {
                const newValue = e.target.value;
                handleInputChange("target_value", newValue === "" ? null : parseFloat(newValue));
              }}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validation-error" className="text-sm font-medium">
              Error Tolerance
            </Label>
            <Input
              placeholder="Error tolerance"
              id="validation-error"
              type="number"
              value={validationState.error ?? ""}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue === "" || /^-?\d*\.?\d*$/.test(newValue)) {
                  handleInputChange("error", newValue === "" ? null : parseFloat(newValue));
                }
              }}
              onBlur={(e) => {
                const newValue = e.target.value;
                handleInputChange("error", newValue === "" ? null : parseFloat(newValue));
              }}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validation-relation" className="text-sm font-medium">
              Relation
            </Label>
            <Select
              value={validationState.relation}
              onValueChange={(value) => handleInputChange("relation", value as relation)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relation" />
              </SelectTrigger>
              <SelectContent>
                {["==", "!=", ">", "<", ">=", "<="].map((rel) => (
                  <SelectItem key={rel} value={rel}>
                    {rel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};
