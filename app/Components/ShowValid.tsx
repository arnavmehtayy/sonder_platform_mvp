import Validation from "@/classes/Validation";
import { CheckCircle, XCircle } from "react-feather";
import { useState } from "react";

const ValidationComponent = ({ validation, updater } : {validation: Validation, updater: () => void}) => {
    const [isChecked, setIsChecked] = useState(false);
  
    const handleCheck = () => {
      setIsChecked(true);
      updater();
      
    };
  
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Validation Check</h3>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleCheck}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Check Validity
          </button>
          {isChecked && (
            <div className="flex items-center">
              {validation.is_valid ? (
                <CheckCircle className="text-green-500 w-6 h-6 mr-2" />
              ) : (
                <XCircle className="text-red-500 w-6 h-6 mr-2" />
              )}
              <span className={validation.is_valid ? "text-green-600" : "text-red-600"}>
                {validation.is_valid ? "Valid" : "Invalid"}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default ValidationComponent;