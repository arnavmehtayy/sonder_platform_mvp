import { TableControl } from "../Controls/TableControl";
import Validation from "./Validation";
import * as val_func from "./Validation_funcs";
import { obj } from "../vizobjects/obj";
import { ValidationConstructor } from "./Validation";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ValidationTableControlInsert, ValidationTableControlSelect } from "@/app/db/schema";

/*
 * Validation class for the TableControl
 * This class checks if the values in the table cells match the expected answers within a specified tolerance
 */
export interface Validation_tableControlConstructor<T extends obj>
  extends ValidationConstructor {
  answers: number[][];
  control_id: number;
  error: number;
  validateCells: boolean[][];
}
export class Validation_tableControl<T extends obj> extends Validation {
  answers: number[][];
  control_id: number; // control that we are validating
  error: number; // tolerance allowed for the answers
  validateCells: boolean[][]; // which cells to validate

  constructor({
    answers,
    control_id,
    desc = "validation_tableControl", // description of the validation that will show on the validation on the autograder
    error = 0.1,
    validateCells,
  }: Validation_tableControlConstructor<T>) {
    super({ is_valid: false, desc: desc });
    this.answers = answers;
    this.control_id = control_id;
    this.error = error;
    this.validateCells = validateCells;
  }

  // method to check if the values in the table cells match the expected answers within the specified tolerance
  // this is used by the storage system
  computeValidity(obj: TableControl<T>): Validation_tableControl<T> {
    let isValid = true;
    console.log(obj, this.answers, this.error);

    for (let i = 0; i < obj.rows.length; i++) {
      for (let j = 0; j < obj.rows[i].cells.length; j++) {
        if (this.validateCells[i][j]) {
          const cellValue = obj.rows[i].cells[j].value;
          const expectedValue = this.answers[i][j];

          if (!val_func.isEqual<number>(expectedValue, cellValue, this.error)) {
            isValid = false;
            break;
          }
        }
      }
      if (!isValid) break;
    }

    return this.set_valid(isValid) as Validation_tableControl<T>;
  }

  dataBaseSave(): Validation_tableControlConstructor<T> {
    return {
      is_valid: this.is_valid,
      desc: this.desc,
      answers: this.answers,
      control_id: this.control_id,
      error: this.error,
      validateCells: this.validateCells,
      type: "V_table",
    };
  }

  static deserialize(data: ValidationTableControlSelect): Validation_tableControl<any> {
    return new Validation_tableControl({
      answers: data.answers,
      control_id: data.control_id,
      desc: data.desc,
      error: data.error,
      validateCells: data.validateCells
    });
  }

  serialize(): Omit<ValidationTableControlInsert, "stateId"> {
    return {
      desc: this.desc,
      answers: this.answers,
      control_id: this.control_id,
      error: this.error,
      validateCells: this.validateCells
    };
  }
}

export interface ValidationTableControlEditorProps {
  onChange: (
    value: Validation_tableControlConstructor<any> | undefined
  ) => void;
  controlId: number;
  rows: number;
  columns: number;
}

export const ValidationTableControlEditor: React.FC<
  ValidationTableControlEditorProps
> = ({ onChange, controlId, rows, columns }) => {
  const [addValidation, setAddValidation] = React.useState(false);
  const [validationState, setValidationState] = React.useState<
    Validation_tableControlConstructor<any>
  >({
    answers: Array(rows).fill(Array(columns).fill(0)),
    control_id: controlId,
    error: 0.1,
    validateCells: Array(rows).fill(Array(columns).fill(true)),
    desc: `Validation for `,
  });

  React.useEffect(() => {
    setValidationState({
      ...validationState,
      answers: Array(rows).fill(Array(columns).fill(0)),
      validateCells: Array(rows).fill(Array(columns).fill(true)),
    });
  }, [rows, columns]);

  React.useEffect(() => {
    if (addValidation) {
      onChange(validationState);
    } else {
      onChange(undefined);
    }
  }, [addValidation, validationState, onChange]);

  const handleInputChange = (
    field: keyof Validation_tableControlConstructor<any>,
    value: any
  ) => {
    setValidationState((prev) => ({ ...prev, [field]: value }));
  };

  const updateAnswerCell = (
    rowIndex: number,
    colIndex: number,
    value: number
  ) => {
    const newAnswers = [...validationState.answers];
    newAnswers[rowIndex] = [...newAnswers[rowIndex]];
    newAnswers[rowIndex][colIndex] = value;
    handleInputChange("answers", newAnswers);
  };

  const updateValidateCell = (
    rowIndex: number,
    colIndex: number,
    value: boolean
  ) => {
    const newValidateCells = [...validationState.validateCells];
    newValidateCells[rowIndex] = [...newValidateCells[rowIndex]];
    newValidateCells[rowIndex][colIndex] = value;
    handleInputChange("validateCells", newValidateCells);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DialogHeader>
          <DialogTitle>Validate Table</DialogTitle>
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
              placeholder="Validation for Table Control __"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validation-error" className="text-sm font-medium">
              Error Tolerance
            </Label>
            <Input
              id="validation-error"
              placeholder="Error tolerance"
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
          <div className="w-full max-w-3xl">
          <Label htmlFor="validation-cellsans" className="text-sm font-medium">
          Expected Answers
          </Label>

            {validationState.answers.length === 0 ? (
              <p>
                No answers available. Please add some answers to begin
                validation.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Row</TableHead>
                    {validationState.answers[0].map((_, colIndex) => (
                      <TableHead key={colIndex} className="text-center">
                        Column {colIndex + 1}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validationState.answers.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell className="font-medium">
                        {rowIndex + 1}
                      </TableCell>
                      {row.map((cell, colIndex) => (
                        <TableCell key={colIndex} className="p-2">
                          <div className="flex flex-col items-center space-y-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`validate-${rowIndex}-${colIndex}`}
                                      checked={
                                        validationState.validateCells[rowIndex][
                                          colIndex
                                        ]
                                      }
                                      onCheckedChange={(checked) =>
                                        updateValidateCell(
                                          rowIndex,
                                          colIndex,
                                          checked === true
                                        )
                                      }
                                    />
                                    <Label
                                      htmlFor={`validate-${rowIndex}-${colIndex}`}
                                      className="text-sm cursor-pointer"
                                    >
                                      Include
                                    </Label>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Check to include this cell in validation
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            {validationState.validateCells[rowIndex][
                              colIndex
                            ] && (
                              <Input
                                placeholder="Value"
                                type="number"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                                    updateAnswerCell(
                                      rowIndex,
                                      colIndex,
                                      value === "" ? 0 : Number(value)
                                    );
                                  }
                                }}
                                onBlur={(e) => {
                                  const value = e.target.value;
                                  if (value !== "") {
                                    updateAnswerCell(
                                      rowIndex,
                                      colIndex,
                                      Number(value)
                                    );
                                  }
                                }}
                                onWheel={(e) => e.currentTarget.blur()}
                                className="w-20 text-center"
                              />
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
