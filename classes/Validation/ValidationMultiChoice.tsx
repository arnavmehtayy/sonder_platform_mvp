import { MultiChoiceClass, MultiChoiceConstructor, Option } from "../Controls/MultiChoiceClass";
import Validation, { ValidationConstructor } from "./Validation";
import React from "react";
import { Checkbox } from "@radix-ui/react-checkbox";


/*
* Validation class for the MultiChoice control
* This class checks if the selected choices are equal to the answer choices
*/

interface ValidationMultiChoiceConstructor extends ValidationConstructor {
    answer: number[];
    control_id: number;
}

export class ValidationMultiChoice extends Validation {
    answer : number[] // the list of objects that should be selected as the MCQ choices
    control_id : number

    constructor({
        answer,
        control_id,
        desc = "validation_select"
    }: ValidationMultiChoiceConstructor) {
        super({ is_valid: false , desc: desc})
        this.answer = answer
        this.control_id = control_id
    }

    // method to check if the selected choices are equal to the answer choices
    // this is used by the storage system
    computeValidity(obj: MultiChoiceClass): ValidationMultiChoice {
        if (this.answer.length === obj.selectedOptions.length) {
            for (let i = 0; i < this.answer.length; i++) {
                if (!obj.selectedOptions.includes(this.answer[i])) {
                    return this.set_valid(false) as ValidationMultiChoice
                }
            }
            return this.set_valid(true) as ValidationMultiChoice
        }
        return this.set_valid(false) as ValidationMultiChoice
    }

    dataBaseSave(): ValidationMultiChoiceConstructor & {type:string} {
        return {
            is_valid: this.is_valid,
            desc: this.desc,
            answer: this.answer,
            control_id: this.control_id,
            type: 'ValidationMultiChoice'
        }
    }
}

    
    export interface MultiChoiceEditorProps {
        onChange: (value: ValidationMultiChoice) => void;
        value: MultiChoiceConstructor
        options: Option[]
        id: number

    }
    
    export const MultiChoiceEditor: React.FC<MultiChoiceEditorProps> = ({onChange, value, options, id}) => {
        const [addValidation, setAddValidation] = React.useState(false);
        const [validationAnswer, setValidationAnswer] = React.useState<number[]>([]);
      
        const handleValidationChange = (optionId: number) => {
          setValidationAnswer(prev => 
            prev.includes(optionId)
              ? prev.filter(id => id !== optionId)
              : [...prev, optionId]
          );
        };
      
        React.useEffect(() => {
          if (addValidation) {
            const newValidation = new ValidationMultiChoice({
              answer: validationAnswer,
              control_id: id,
              desc: "Validation for " + value.title
            });
            onChange(newValidation);
          } else {
            // onChange(undefined);
          }
        }, [addValidation, validationAnswer, id, value.title]);
      
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="add-validation"
                checked={addValidation}
                onCheckedChange={(checked) => setAddValidation(checked as boolean)}
              />
              <label htmlFor="add-validation" className="text-sm font-medium text-gray-700">
                Add Validation
              </label>
            </div>
            {addValidation && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Select correct answer(s):</p>
                {options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`option-${option.id}`}
                      checked={validationAnswer.includes(option.id)}
                      onCheckedChange={() => handleValidationChange(option.id)}
                    />
                    <label htmlFor={`option-${option.id}`} className="text-sm text-gray-600">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      };






