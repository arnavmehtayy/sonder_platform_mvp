import Validation from "./Validation";
import { obj } from "../vizobjects/obj";
import { relation } from "./Validation_obj";
import { ValidationConstructor } from "./Validation";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ValidationScoreInsert, ValidationScoreSelect } from "@/app/db/schema";


/*
 * this class stores information to validate a score
 * score_T represents the type of the score that is to be validated
 * obj_T represents the type of the object that is to be validated
 * attributes: score_id, target_score, error, relation, comparator
 */

export interface Validation_score_constructor<score_T, obj_T extends obj> extends ValidationConstructor {
  score_id: number;
  target_score: score_T;
  error: number;
  relation: relation;
  comparator?: (a: score_T, b: score_T) => number;
}
export default class Validation_score<
  score_T,
  obj_T extends obj
> extends Validation {
  score_id: number;
  target_score: score_T;
  error: number;
  relation: relation; // this is the relation that is to be used in the comparison
  comparator: (a: score_T, b: score_T) => number; // this is the function that is used to compare the scores

  constructor({
    score_id,
    target_score,
    error,
    relation,
    comparator = (a, b) => (a > b ? 1 : a < b ? -1 : 0),
    desc = "validation_score",
  }: Validation_score_constructor<score_T, obj_T>) {
    super({ is_valid: false, desc: desc });
    this.score_id = score_id;
    this.target_score = target_score;
    this.error = error;
    this.relation = relation;
    this.comparator = comparator;
  }


  // method that given the score computes the validity of that score
  // this is used by the storage system
  computeValidity(score: score_T): Validation_score<string, obj_T> {
    // console.log("score", score, this.target_score);
    switch (this.relation) {
      case ">":
        if (this.comparator(score, this.target_score) > -this.error) {
          return this.set_valid(true) as Validation_score<string, obj_T>;
        }
        break;
      case "<":
        if (this.comparator(score, this.target_score) < this.error) {
          return this.set_valid(true) as Validation_score<string, obj_T>;
        }
        break;
      case ">=":
        if (this.comparator(score, this.target_score) >= -this.error) {
          return this.set_valid(true) as Validation_score<string, obj_T>;
        }
        break;
      case "<=":
        if (this.comparator(score, this.target_score) <= this.error) {
          return this.set_valid(true) as Validation_score<string, obj_T>;
        }
        break;
      case "!=":
        if (Math.abs(this.comparator(score, this.target_score)) > this.error) {
          return this.set_valid(true) as Validation_score<string, obj_T>;
        }
        break;
      case "==":
        if (Math.abs(this.comparator(score, this.target_score)) < this.error) {
          return this.set_valid(true) as Validation_score<string, obj_T>;
        }
        break;
    }
    return this.set_valid(false) as Validation_score<string, obj_T>;
  }

  dataBaseSave(): Validation_score_constructor<score_T, obj_T>  {
    return {
      is_valid: this.is_valid,
      desc: this.desc,
      score_id: this.score_id,
      target_score: this.target_score,
      error: this.error,
      relation: this.relation,
      type: "V_score"
    };
  }

  static deserialize(data: ValidationScoreSelect): Validation_score<any, any> {
    return new Validation_score({
      score_id: data.score_id,
      target_score: data.target_score,
      error: data.error,
      relation: data.relation,
      desc: data.desc
    });
  }

  serialize(): Omit<ValidationScoreInsert, "stateId"> {
    return {
      desc: this.desc,
      score_id: this.score_id,
      target_score: this.target_score,
      error: this.error,
      relation: this.relation,
    };
  }
}

export interface ValidationScoreEditorProps {
  onChange: (value: Validation_score_constructor<number, obj> | undefined) => void;
  scoreId: number;
}

export const ValidationScoreEditor: React.FC<ValidationScoreEditorProps> = ({
  onChange,
  scoreId,
}) => {
  const [addValidation, setAddValidation] = React.useState(false);
  const [validationState, setValidationState] = React.useState<Validation_score_constructor<number, obj>>({
    score_id: scoreId,
    target_score: 0,
    error: 0.1,
    relation: "==",
    desc: `This is a score Validator`,
    comparator: (a,b) => a-b
  });

  React.useEffect(() => {
    if (addValidation ) {
      onChange(validationState);
    } else {
      onChange(undefined);
    }
  }, [addValidation, validationState, onChange]);

  const handleAddRemoveValidation = () => {
    const newAddValidation = !addValidation;
    setAddValidation(newAddValidation);
    if (newAddValidation) {
      onChange(new Validation_score(validationState));
    } else {
      onChange(undefined);
    }
  };

  const handleInputChange = (field: keyof Validation_score_constructor<number, obj>, value: any) => {
    setValidationState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DialogHeader>
          <DialogTitle>Score Validation</DialogTitle>
        </DialogHeader>
        <Button
          variant={addValidation ? "default" : "outline"}
          size="sm"
          onClick={handleAddRemoveValidation}
        >
          {addValidation ? "Remove Validation" : "Add Validation"}
        </Button>
      </div>
      {addValidation && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="validation-desc" className="text-sm font-medium">
              Validate Score
            </Label>
            <Input
              id="validation-desc"
              value={validationState.desc}
              onChange={(e) => handleInputChange("desc", e.target.value)}
              placeholder="Validation for Score"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validation-target" className="text-sm font-medium">
              Target Score
            </Label>
            <Input
              placeholder="Target score"
              id="validation-target"
              type="number"
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                  handleInputChange("target_score", value === "" ? null : value);
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value !== "") {
                  handleInputChange("target_score", value);
                }
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
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                  handleInputChange("error", value === "" ? null : value);
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value !== "") {
                  handleInputChange("error", value);
                }
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
