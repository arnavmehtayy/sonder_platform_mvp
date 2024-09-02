import React, { useState } from "react";
import { CheckCircle, XCircle } from "react-feather";
import Validation from "@/classes/Validation/Validation";
import { useStore, isValidatorClickableSelector } from "@/app/store";

const ValidationComponent = ({
  validations,
  updater,
}: {
  validations: Validation[];
  updater: () => void;
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [overallValidity, setOverallValidity] = useState(false);
  const isActive = useStore(isValidatorClickableSelector);

  const handleCheck = () => {
    setIsChecked(true);
    updater();
    const allValid = validations.every((validation) => validation.is_valid);
    setOverallValidity(allValid);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 mb-6 ${
        !isActive ? "opacity-50" : ""
      } relative`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-800">Autograder</h3>
        <button
          onClick={handleCheck}
          disabled={!isActive}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300
          ${!isActive && "opacity-50 cursor-not-allowed"}
                  text-white py-1 px-3 rounded-md text-sm font-medium transition duration-300 ease-in-out
                  flex items-center`}
        >
          Check Validity
        </button>
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
