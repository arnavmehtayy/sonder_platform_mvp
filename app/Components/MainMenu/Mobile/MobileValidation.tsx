import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import Validation from "@/classes/Validation/Validation";
import { useState } from "react";

interface MobileValidationProps {
  validations: Validation[];
  showResults: boolean;
}

export function MobileValidation({
  validations,
  showResults,
}: MobileValidationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const overallValidity = validations.every(
    (validation) => validation.is_valid
  );

  if (!showResults) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-xl shadow-lg mx-4 mb-4 overflow-hidden"
    >
      {/* Summary Bar */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-3">
          {overallValidity ? (
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          ) : (
            <div className="bg-red-100 p-2 rounded-full">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          )}
          <div>
            <h3 className="font-medium">
              {overallValidity ? "All Correct!" : "Some Answers Need Work"}
            </h3>
            <p className="text-sm text-gray-500">
              {validations.filter((v) => v.is_valid).length} of{" "}
              {validations.length} correct
            </p>
          </div>
        </div>
        {validations.length > 0 && (
          <button
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={showDetails ? "Hide details" : "Show details"}
          >
            {showDetails ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
        )}
      </div>

      {/* Detailed Results */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100"
          >
            <ul className="divide-y divide-gray-100">
              {validations.map((validation, index) => (
                <li
                  key={index}
                  className={`p-4 flex items-start gap-3 ${
                    validation.is_valid ? "bg-green-50/50" : "bg-red-50/50"
                  }`}
                >
                  {validation.is_valid ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <span
                    className={
                      validation.is_valid ? "text-green-700" : "text-red-700"
                    }
                  >
                    {validation.desc}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
