import Validation from "./Validation";
import { Vector2, Vector3 } from "three";
import { TransformObj } from "../vizobjects/transformObj";
import * as Val_func from "./Validation_funcs";
import { ValidationConstructor } from "./Validation";
import { att_type, atts } from "../vizobjects/get_set_obj_attributes";
import { obj, object_types } from "../vizobjects/obj";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogTitle, DialogHeader } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { geomobj, geomobjconstructor } from "../vizobjects/geomobj";

export type value_typ = att_type; // the possible types of the attribute that is to be validated
export type relation = "==" | ">" | "<" | ">=" | "<=" | "!="; // the possible relations that can be used in the comparison

/*
 * this class stores information to validate a vizobjects attribute
 * T represents the type of the attribute that is to be validated
 * the attributes of this class are: answer, obj_id,
 * get_attribute: function that gets the attribute of the object
 * error: the error that is allowed in the comparison
 * relation: the relation that is to be used in the comparison
 */

interface Attribute_get {
  obj_type: object_types;
  func: string;
}

export interface Validation_obj_constructor<T extends value_typ>
  extends ValidationConstructor {
  answer: T;
  obj_id: number;
  // get_attribute: (obj: TransformObj) => T;
  get_attribute_json: Attribute_get;
  error?: number;
  relation?: relation;
}
export default class Validation_obj<T extends value_typ> extends Validation {
  answer: T; // the answer that the attribute should be
  obj_id: number; // the id of the object that is to be validated
  get_attribute_json: Attribute_get; // function that gets the attribute of the object
  get_attribute: (obj: obj) => T;
  error: number;
  relation: relation; // this is the relation that is to be used in the comparison

  constructor({
    obj_id,
    answer,
    get_attribute_json,
    error = 0,
    relation = "==",
    desc = "validation_obj",
  }: Validation_obj_constructor<T>) {
    super({ is_valid: false, desc: desc });

    // console.log(get_attribute_json) // testing
    this.answer = answer;
    this.obj_id = obj_id;
    this.get_attribute_json = get_attribute_json;
    // console.log(get_attribute_json);
    this.get_attribute = atts[get_attribute_json.obj_type]![
      typeof this.answer === "number"
        ? "number"
        : typeof this.answer === "string"
        ? "string"
        : "boolean"
    ][get_attribute_json.func].get_attribute as (obj: obj) => T;

    this.error = error;
    this.relation = relation;
  }

  // method that given the object computes the validity of the object
  // this is used by the storage system
  computeValidity(obj: TransformObj): Validation_obj<T> {
    switch (this.relation) {
      case ">":
        if (
          Val_func.compare(this.get_attribute(obj), this.answer, this.error) > 0
        ) {
          return this.set_valid(true) as Validation_obj<T>;
        }
        break;
      case "<":
        if (
          Val_func.compare(this.get_attribute(obj), this.answer, this.error) < 0
        ) {
          return this.set_valid(true) as Validation_obj<T>;
        }
        break;
      case ">=":
        if (
          Val_func.compare(this.get_attribute(obj), this.answer, this.error) >=
          0
        ) {
          return this.set_valid(true) as Validation_obj<T>;
        }
        break;
      case "<=":
        if (
          Val_func.compare(this.get_attribute(obj), this.answer, this.error) <=
          0
        ) {
          return this.set_valid(true) as Validation_obj<T>;
        }
        break;
      case "!=":
        if (
          Val_func.compare(this.get_attribute(obj), this.answer, this.error) !==
          0
        ) {
          return this.set_valid(true) as Validation_obj<T>;
        }
        break;
      case "==":
        if (
          Val_func.compare(this.get_attribute(obj), this.answer, this.error) ===
          0
        ) {
          return this.set_valid(true) as Validation_obj<T>;
        }
    }

    return this.set_valid(false) as Validation_obj<T>;
  }

  dataBaseSave(): Validation_obj_constructor<T> & { type: string } {
    return {
      is_valid: this.is_valid,
      desc: this.desc,
      answer: this.answer,
      obj_id: this.obj_id,
      get_attribute_json: this.get_attribute_json,
      error: this.error,
      relation: this.relation,
      type: "Validation_obj",
    };
  }
}

export interface ValidationObjEditorProps {
  onChange: (value: Validation_obj_constructor<any> | undefined) => void;
  value: geomobjconstructor;
  id: number;
}

export const ValidationObjEditor: React.FC<ValidationObjEditorProps> = ({
  onChange,
  value,
  id,
}) => {
  const [addValidation, setAddValidation] = React.useState(false);
  const [validationState, setValidationState] = React.useState<Validation_obj_constructor<number>>({
    answer: 0,
    obj_id: id,
    get_attribute_json: { obj_type: "GeomObj", func: "" },
    error: 0,
    relation: "==",
    desc: `Validation for ${value.name}`,
  });

  React.useEffect(() => {
    if (addValidation && validationState.get_attribute_json.func) {
      onChange(validationState);
    } else {
      onChange(undefined);
    }
  }, [addValidation, validationState, onChange]);

  const handleInputChange = (field: keyof Validation_obj_constructor<number>, value: any) => {
    setValidationState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DialogHeader>
          <DialogTitle>Validation</DialogTitle>
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
              placeholder="Validation for __"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attribute-select" className="text-sm font-medium">
              Select Attribute
            </Label>
            <Select
              onValueChange={(value) => handleInputChange("get_attribute_json", { ...validationState.get_attribute_json, func: value })}
              value={validationState.get_attribute_json.func}
            >
              <SelectTrigger id="attribute-select">
                <SelectValue placeholder="Select attribute" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(atts["GeomObj"]!["number"]).map((attr) => (
                  <SelectItem key={attr} value={attr}>
                    {attr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="relation-select" className="text-sm font-medium">
              Select Relation
            </Label>
            <Select
              onValueChange={(value) => handleInputChange("relation", value as relation)}
              value={validationState.relation}
            >
              <SelectTrigger id="relation-select">
                <SelectValue placeholder="Select relation" />
              </SelectTrigger>
              <SelectContent>
                {["==", ">", "<", ">=", "<=", "!="].map((rel) => (
                  <SelectItem key={rel} value={rel}>
                    {rel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="validation-answer" className="text-sm font-medium">
              Expected Value
            </Label>
            <Input
              id="validation-answer"
              placeholder="Expected value"
              type="number"
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                  handleInputChange("answer", value === "" ? 0 : Number(value));
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value !== "") {
                  handleInputChange("answer", Number(value));
                }
              }}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validation-error" className="text-sm font-medium">
              Error Margin
            </Label>
            <Input
              id="validation-error"
              placeholder="Error margin"
              type="number"
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                  handleInputChange("error", value === "" ? 0 : Number(value));
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value !== "") {
                  handleInputChange("error", Number(value));
                }
              }}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
        </div>
      )}
    </div>
  );
};
