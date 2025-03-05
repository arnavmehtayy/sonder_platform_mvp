import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { InputNumber } from "../InputNumber";
import { Validation_inputNumber } from "@/classes/Validation/Validation_inputNumber";
import { useStore, getValidationsSelector } from "@/app/store";
import Latex from "react-latex-next";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface InputNumberAutograderEditProps {
  control: InputNumber;
  onClose: () => void;
}

export const InputNumberAutograderEdit: React.FC<
  InputNumberAutograderEditProps
> = ({ control, onClose }) => {
  // Find existing validation for this control
  const validations = useStore(getValidationsSelector);
  const existingValidation = React.useMemo(() => {
    return validations.find(
      (v) => v instanceof Validation_inputNumber && v.control_id === control.id
    ) as Validation_inputNumber | undefined;
  }, [validations, control.id]);

  // Initialize with existing validation values if available
  const [targetValue, setTargetValue] = React.useState<string>(
    existingValidation
      ? existingValidation.answer.toString()
      : (control.value as number)?.toString() || ""
  );

  const title = control.desc;
  const description = control.text;

  const saveAutograder = () => {
    const addElementFn = useStore.getState().addElement;
    const deleteValidationByIndex = useStore.getState().deleteValidationByIndex;

    // If there's an existing validation, update it by removing the old one first
    if (existingValidation) {
      const existingIndex = validations.findIndex(
        (v) =>
          v instanceof Validation_inputNumber && v.control_id === control.id
      );

      if (existingIndex !== -1) {
        deleteValidationByIndex(existingIndex);
      }
    }

    // Create and add the new validation
    const newValidation = new Validation_inputNumber({
      answer: targetValue === "" ? 0 : parseFloat(targetValue),
      control_id: control.id,
      error: 0,
      desc: `${control.desc}`,
    });

    addElementFn(newValidation);
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 relative ring-2 ring-green-500 bg-green-50">
      <div className="absolute top-0 left-0 w-full bg-green-600 text-white text-xs px-4 py-1 rounded-t-lg">
        Set the expected answer for autograding
      </div>

      <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">
        <Latex>{title}</Latex>
      </h3>
      <p className="text-gray-600 mb-4">
        <Latex>{description}</Latex>
      </p>

      <div className="space-y-4 mt-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Expected Answer:</Label>
          <Input
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            className="w-full"
            step="any"
          />
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      <div className="flex justify-end space-x-2 pt-4 mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-red-600"
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={saveAutograder}
          className="bg-green-600 hover:bg-green-700"
        >
          <Check className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  );
};
