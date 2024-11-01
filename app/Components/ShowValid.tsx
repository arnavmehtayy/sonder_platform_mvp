import React, { useState } from "react";
import { CheckCircle, XCircle } from "react-feather";
import Validation from "@/classes/Validation/Validation";
import { useStore, isValidatorClickableSelector } from "@/app/store";
import { Button } from "@/components/ui/button";

// This component is responsible for rendering the validation box in the sidebar UI


const ValidationComponent = ({
  validations,
  updater, // function to update the state of each of the validations in the store 
}: {
  validations: Validation[];
  updater: () => void; 
}) => {
  const [isChecked, setIsChecked] = useState(false); // to decide whether the user has clicked the check button and show the results accordingly
  const [overallValidity, setOverallValidity] = useState(false);
  const isActive = useStore(isValidatorClickableSelector);

  const handleCheck = () => {
    setIsChecked(true);
    updater(); 
    const allValid = validations.every((validation) => validation.is_valid);
    setOverallValidity(allValid);
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-blue-800">Autograder</h3>
        <Button
          onClick={handleCheck}
          disabled={!isActive}
          className={`flex items-center gap-2 ${
            !isActive 
              ? 'opacity-50 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          size="sm"
        >
          <CheckCircle size={16} />
          Check Validity
        </Button>
      </div>

      {isChecked && (
        <div className="flex items-center justify-end mb-4">
          {overallValidity ? (
            <CheckCircle className="text-green-500 w-6 h-6 mr-2" />
          ) : (
            <XCircle className="text-red-500 w-6 h-6 mr-2" />
          )}
          <span className={overallValidity ? "text-green-600" : "text-red-600"}>
            {overallValidity ? "Valid" : "Invalid"}
          </span>
        </div>
      )}
      {isChecked && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Individual Results:</h4>
          <ul>
            {validations.map((validation, index) => (
              <li key={index} className="flex items-center mb-2">
                {validation.is_valid ? (
                  <CheckCircle className="text-green-500 w-4 h-4 mr-2" />
                ) : (
                  <XCircle className="text-red-500 w-4 h-4 mr-2" />
                )}
                <span
                  className={
                    validation.is_valid ? "text-green-600" : "text-red-600"
                  }
                >
                  {validation.desc}: {validation.is_valid ? "Valid" : "Invalid"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ValidationComponent;
