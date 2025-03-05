import {
  MultiChoiceClass,
  MultiChoiceConstructor,
  Option,
} from "../Controls/MultiChoiceClass";
import Validation, { ValidationConstructor } from "./Validation";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogTitle, DialogHeader } from "@/components/ui/dialog";
import {
  Validation_MultiChoice,
  Validation_MultiChoiceInsert,
  Validation_MultiChoiceSelect,
} from "@/app/db/schema";

/*
 * Validation class for the MultiChoice control
 * This class checks if the selected choices are equal to the answer choices
 */

interface ValidationMultiChoiceConstructor extends ValidationConstructor {
  answer: number[];
  control_id: number;
}

export class ValidationMultiChoice extends Validation {
  answer: number[]; // the list of objects that should be selected as the MCQ choices
  control_id: number;

  constructor({
    answer,
    control_id,
    desc = "validation_multichoice",
  }: ValidationMultiChoiceConstructor) {
    super({ is_valid: false, desc: desc });
    this.answer = answer;
    this.control_id = control_id;
  }

  // method to check if the selected choices are equal to the answer choices
  // this is used by the storage system
  computeValidity(obj: MultiChoiceClass): ValidationMultiChoice {
    if (this.answer.length === obj.selectedOptions.length) {
      for (let i = 0; i < this.answer.length; i++) {
        if (!obj.selectedOptions.includes(this.answer[i])) {
          return this.set_valid(false) as ValidationMultiChoice;
        }
      }
      return this.set_valid(true) as ValidationMultiChoice;
    }
    return this.set_valid(false) as ValidationMultiChoice;
  }

  dataBaseSave(): ValidationMultiChoiceConstructor & { type: string } {
    return {
      is_valid: this.is_valid,
      desc: this.desc,
      answer: this.answer,
      control_id: this.control_id,
      type: "V_MCQ",
    };
  }

  static deserialize(
    data: Validation_MultiChoiceSelect
  ): ValidationMultiChoice {
    return new ValidationMultiChoice({
      answer: data.answer,
      control_id: data.control_id,
      desc: data.desc,
    });
  }

  serialize(): Omit<Validation_MultiChoiceInsert, "stateId"> {
    return {
      desc: this.desc,
      answer: this.answer,
      control_id: this.control_id,
    };
  }
}

export interface MultiChoiceEditorProps {
  onChange: (value: ValidationMultiChoice | undefined) => void;
  value: MultiChoiceConstructor;
  options: Option[];
  id: number;
}

export const MultiChoiceEditor: React.FC<MultiChoiceEditorProps> = ({
  onChange,
  value,
  options,
  id,
}) => {
  const [addValidation, setAddValidation] = React.useState(false);
  const [validationAnswer, setValidationAnswer] = React.useState<number[]>([]);

  const handleValidationChange = (optionId: number) => {
    setValidationAnswer((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  React.useEffect(() => {
    if (addValidation) {
      const newValidation = new ValidationMultiChoice({
        answer: validationAnswer,
        control_id: id,
        desc: "Autograder for MCQ",
      });
      onChange(newValidation);
    } else {
      onChange(undefined);
    }
  }, [addValidation, validationAnswer, id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DialogHeader>
          <DialogTitle> Autograder </DialogTitle>
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
            <Label className="text-sm font-medium">
              Select correct answer(s):
            </Label>
            <div className="space-y-2">
              {options.length === 0 ? (
                <div className="text-sm text-gray-500 italic">
                  Please add options to the multiple choice question first
                </div>
              ) : (
                options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 py-2"
                  >
                    <Checkbox
                      id={`option-${option.id}`}
                      checked={validationAnswer.includes(option.id)}
                      onCheckedChange={() => handleValidationChange(option.id)}
                    />
                    <Label
                      htmlFor={`option-${option.id}`}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
