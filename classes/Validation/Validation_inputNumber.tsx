

import { InputNumber } from "../Controls/InputNumber";
import Validation from "./Validation";
import * as val_func from "./Validation_funcs";
import { ValidationConstructor } from "./Validation";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogTitle, DialogHeader } from "@/components/ui/dialog";

/*
 * Validation class for the InputNumber control
 * This class checks if the value of the input number is equal to the answer with some tolerance allowanc

*/

export interface Validation_inputNumberConstructor extends ValidationConstructor {
  answer: number;
  control_id: number;
  error: number;
}
export class Validation_inputNumber extends Validation {
  answer: number;
  control_id: number; // control that we are validating
  error: number; // tolerance allowed for the answer

  constructor({
    answer,
    control_id,
    desc = "validation_inputNumber", // description of the validation that will show on the validation on the autograder
    error = 1,
  }: Partial<Validation_inputNumber> & {
    answer: number;
    control_id: number;
  }) {
    super({ is_valid: false, desc: desc });
    this.answer = answer;
    this.control_id = control_id;
    this.error = error;
  }


  // method to check if the value of the input number is equal to the answer with some tolerance
  // this is used by the storage system
  computeValidity(obj: InputNumber): Validation_inputNumber {
    if (
      obj.value !== "" &&
      val_func.isEqual<number>(this.answer, obj.value, this.error) 
    ) {
      return this.set_valid(true) as Validation_inputNumber;
    }
    return this.set_valid(false) as Validation_inputNumber;
  }

  dataBaseSave(): Validation_inputNumberConstructor{
    return {
      is_valid: this.is_valid,
      desc: this.desc,
      answer: this.answer,
      control_id: this.control_id,
      error: this.error,
      type: "V_numberIn"
    };
  }
}


export interface ValidationInputNumberEditorProps {
  onChange: (value: Validation_inputNumberConstructor | undefined) => void;
  controlId: number;
}

export const ValidationInputNumberEditor: React.FC<ValidationInputNumberEditorProps> = ({
  onChange,
  controlId,
}) => {
  const [addValidation, setAddValidation] = React.useState(false);
  const [validationState, setValidationState] = React.useState<Validation_inputNumberConstructor>({
    answer: 0,
    control_id: controlId,
    error: 1,
    desc: `Validation for Input Number`,
  });

  React.useEffect(() => {
    if (addValidation) {
      onChange(validationState);
    } else {
      onChange(undefined);
    }
  }, [addValidation, validationState, onChange]);

  const handleInputChange = (field: keyof Validation_inputNumberConstructor, value: any) => {
    setValidationState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DialogHeader>
          <DialogTitle>Validate Number</DialogTitle>
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
              placeholder="Validation for Input Number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validation-answer" className="text-sm font-medium">
              Expected Answer
            </Label>
            <Input
              id="validation-answer"
              type="number"
              value={validationState.answer ?? ""}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue === "" || /^-?\d*\.?\d*$/.test(newValue)) {
                  handleInputChange("answer", newValue === "" ? null : parseFloat(newValue));
                }
              }}
              onBlur={(e) => {
                const newValue = e.target.value;
                handleInputChange("answer", newValue === "" ? null : parseFloat(newValue));
              }}
              onWheel={(e) => e.currentTarget.blur()}
              placeholder="Expected answer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validation-error" className="text-sm font-medium">
              Error Tolerance
            </Label>
            <Input
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
              placeholder="Error tolerance"
            />
          </div>
        </div>
      )}
    </div>
  );
};