import {SelectControl} from "../Controls/SelectControl"
import Validation from "./Validation"
import {ValidationConstructor} from "./Validation"
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogTitle, DialogHeader } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getObjectSelector2, getNameSelector, useStore } from '@/app/store';

/* 
* Validation class for the Select control
* This class checks if the selected objects are equal to the answer objects
* attributes of this class are: answer, control_id
*/

export interface Validation_selectConstructor extends ValidationConstructor {
    answer: number[];
    control_id: number;
}

export default class Validation_select extends Validation {
    answer: number[] // the list of objects that should be selected
    control_id: number 

    constructor({
        answer,
        control_id,
        desc = "validation_select"
    }: Partial<Validation_select> & {
        
        answer: number[],
        control_id: number
    }) {
        super({ is_valid: false , desc: desc})
        this.answer = answer
        this.control_id = control_id
    }

    // method to check if the selected objects are equal to the answer objects
    // this is used by the storage system
    computeValidity(obj: SelectControl): Validation_select {
        if (this.answer.length === obj.selected.length) {
            for (let i = 0; i < this.answer.length; i++) {
                if (!obj.selected.includes(this.answer[i])) {
                    return this.set_valid(false) as Validation_select
                }
            }
            return this.set_valid(true) as Validation_select
        }
        return this.set_valid(false) as Validation_select
    }

    dataBaseSave(): Validation_selectConstructor & {type: string} {
        return {
            is_valid: this.is_valid,
            desc: this.desc,
            answer: this.answer,
            control_id: this.control_id,
            type: "Validation_select"
        }
    }
}

export interface ValidationSelectEditorProps {
    onChange: (value: Validation_selectConstructor | undefined) => void;
    controlId: number;
    selectableObjects: number[];
  }
  
  export const ValidationSelectEditor: React.FC<ValidationSelectEditorProps> = ({
    onChange,
    controlId,
    selectableObjects,
  }) => {
    const [addValidation, setAddValidation] = React.useState(false);
    const [validationState, setValidationState] = React.useState<Validation_selectConstructor>({
      answer: [],
      control_id: controlId,
      desc: `Validation for Select Control`,
    });
    const getObjectName = useStore(getNameSelector);
  
    React.useEffect(() => {
      if (addValidation) {
        onChange(validationState);
      } else {
        onChange(undefined);
      }
    }, [addValidation, validationState, onChange]);
  
    const handleInputChange = (field: keyof Validation_selectConstructor, value: any) => {
      setValidationState(prev => ({ ...prev, [field]: value }));
    };
  
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <DialogHeader>
            <DialogTitle>Validate Object Select</DialogTitle>
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
                placeholder="Validation for Select Control"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer-select" className="text-sm font-medium">
                Expected Answer
              </Label>
              <Select
                onValueChange={(value) => handleInputChange("answer", [...validationState.answer, parseInt(value)])}
              >
                <SelectTrigger id="answer-select">
                  <SelectValue placeholder="Select expected objects" />
                </SelectTrigger>
                <SelectContent>
                  {selectableObjects.map((objId) => (
                    <SelectItem key={objId} value={objId.toString()}>
                      {getObjectName(objId)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Selected Objects</Label>
              <div className="mt-2 space-y-2">
                {validationState.answer.map((objId, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span>{getObjectName(objId)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleInputChange("answer", validationState.answer.filter(id => id !== objId))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };