"use client";
import React, { useEffect, useState } from "react";
import Experience from "../visualexp";
import {
  useStore,
  getStateName,
  getPlacementListSelector,
  State,
  UpdateValidationSelector,
} from "@/app/store";
import "katex/dist/katex.min.css";
import "../style.css";
import ValidationComponent from "../ShowValid";
import { OrderHandler } from "./OrderHandler";
import { CheckCircle } from 'lucide-react';

export function MinigameEdit({}: {}) {
  const reset = useStore((state) => state.reset);
  const state_name = useStore(getStateName);
  const placement = useStore(getPlacementListSelector);
  const updateValidation = useStore(UpdateValidationSelector);
  const validationInstance = useStore((state) => state.validations);
  const [stateName, setStateName] = useState("");
  const [showValidation, setShowValidation] = useState(true);
  const [allValidationsValid, setAllValidationsValid] = useState(false);

  useEffect(() => reset("default"), []);

  const handleValidationUpdate = () => {
    updateValidation();
  };

  useEffect(() => {
    const checkAllValidations = () => {
      const allValid = validationInstance.every((validation) => validation.get_isValid());
      setAllValidationsValid(allValid);
    };
    checkAllValidations();
  }, [validationInstance]);

  const handleSaveState = async () => {
    // ... (existing save state logic)
  };
  
  const handleLoadState = async () => {
    // ... (existing load state logic)
  };

  return (
    <div className="relative flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Main Three.js Experience */}
      <div className="flex-grow bg-black h-1/2 md:h-full md:flex-1">
        <Experience />
      </div>

      {/* Floating Validation Button */}
      <button
        onClick={() => setShowValidation(!showValidation)}
        className={`absolute bottom-4 left-4 flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300 z-10 ${
          allValidationsValid ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {allValidationsValid && <CheckCircle className="text-white" size={20} />}
        <span className="text-white font-semibold">
          {showValidation ? 'Hide' : 'Show'} Grader
        </span>
      </button>

      {/* Validation Overlay */}
      <div
        className={`absolute bottom-16 left-4 w-80 bg-white bg-opacity-90 rounded-lg shadow-xl p-4 transition-all duration-300 ${
          showValidation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
        } z-20`}
      >
        <ValidationComponent
          validations={validationInstance}
          updater={handleValidationUpdate}
        />
      </div>

      {/* Sidebar */}
      <div
        className="w-full md:w-1/3 md:min-w-[300px] md:max-w-md bg-blue-50 p-4 overflow-y-auto h-1/2 md:h-full"
        style={{ height: "100lvh" }}
      >
        <div className="space-y-4 md:space-y-6">
          <OrderHandler state_name={state_name} />

          <br />
          <br />
          <br />

          <div className="mt-4 p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold mb-2">State Management</h3>
            <input
              type="text"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              placeholder="Enter state name"
              className="w-full p-2 border rounded mb-2"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSaveState}
                className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
              >
                Save State
              </button>
              <button
                onClick={handleLoadState}
                className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
              >
                Load State
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}