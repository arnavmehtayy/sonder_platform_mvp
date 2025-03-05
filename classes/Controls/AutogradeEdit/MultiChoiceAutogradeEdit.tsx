import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { MultiChoiceClass } from "../MultiChoiceClass";
import { ValidationMultiChoice } from "@/classes/Validation/ValidationMultiChoice";
import { useStore, getValidationsSelector } from "@/app/store";
import Latex from "react-latex-next";

interface MultiChoiceAutograderEditProps {
  control: MultiChoiceClass;
  onClose: () => void;
}

export const MultiChoiceAutograderEdit: React.FC<
  MultiChoiceAutograderEditProps
> = ({ control, onClose }) => {
  // Find existing validation for this control
  const validations = useStore(getValidationsSelector);
  const existingValidation = React.useMemo(() => {
    return validations.find(
      (v) => v instanceof ValidationMultiChoice && v.control_id === control.id
    ) as ValidationMultiChoice | undefined;
  }, [validations, control.id]);

  // Get the current valid option IDs from the control
  const validOptionIds = control.options.map((option) => option.id);

  // Initialize autograder answers with existing validation answers if available
  // Filter out any option IDs that no longer exist in the control
  const [autograderAnswers, setAutograderAnswers] = React.useState<number[]>(
    existingValidation
      ? existingValidation.answer.filter((id) => validOptionIds.includes(id))
      : []
  );

  const title = control.desc;
  const description = control.text;
  const options = control.options;
  const isMultiSelect = control.isMultiSelect;

  const handleOptionClick = (optionId: number) => {
    if (isMultiSelect) {
      // For multi-select questions, toggle the selected option
      setAutograderAnswers((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      // For single-select questions, replace the selection
      setAutograderAnswers([optionId]);
    }
  };

  const saveAutograder = () => {
    const addElementFn = useStore.getState().addElement;
    const deleteValidationByIndex = useStore.getState().deleteValidationByIndex;

    // If there's an existing validation, update it by removing the old one first
    if (existingValidation) {
      const existingIndex = validations.findIndex(
        (v) => v instanceof ValidationMultiChoice && v.control_id === control.id
      );

      if (existingIndex !== -1) {
        deleteValidationByIndex(existingIndex);
      }
    }

    // Create and add the new validation
    const newValidation = new ValidationMultiChoice({
      answer: autograderAnswers,
      control_id: control.id,
      desc: existingValidation ? existingValidation.desc : `${control.desc}`,
    });

    addElementFn(newValidation);
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 relative ring-2 ring-green-500 bg-green-50">
      <div className="absolute top-0 left-0 w-full bg-green-600 text-white text-xs px-4 py-1 rounded-t-lg">
        Select the correct answer{isMultiSelect ? "s" : ""} for autograding
      </div>

      <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">
        <Latex>{title}</Latex>
      </h3>
      <p className="text-gray-600 mb-4">
        <Latex>{description}</Latex>
      </p>
      <div className="space-y-3">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            className={`
              w-full text-left px-4 py-3 rounded-lg 
              transition-all duration-400 ease-out
              transform hover:scale-[1.02] active:scale-[0.98]
              ${
                autograderAnswers.includes(option.id)
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
              cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
            `}
          >
            <div className="flex items-center">
              <div
                className={`
                w-5 h-5 mr-3 flex-shrink-0
                transition-all duration-200 ease-out
                ${isMultiSelect ? "rounded" : "rounded-full"}
                ${
                  autograderAnswers.includes(option.id)
                    ? "border-white bg-white scale-110"
                    : "border-2 border-green-500 bg-transparent"
                }
              `}
              >
                {autograderAnswers.includes(option.id) && (
                  <svg
                    className="w-3 h-4 mx-auto mt-0.5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-left">
                <Latex>{option.label}</Latex>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Save/Cancel Buttons moved to bottom */}
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
