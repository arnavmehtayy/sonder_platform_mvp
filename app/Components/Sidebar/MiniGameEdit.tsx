"use client";
import React, { useEffect, useState } from "react";
import Experience from "../visualexp";

import {
  useStore,
  getStateName,
  getPlacementSelector,
  State,
  UpdateValidationSelector,
  getPlacementListSelector,
} from "@/app/store";

import "katex/dist/katex.min.css";
import "../style.css";
import ValidationComponent from "../ShowValid";
import { OrderHandler } from "./OrderHandler";

/*
 * This is the same as the MiniGame component but designed for the editing page
 * TODO
 */

export function MinigameEdit({}: {}) {
  const reset = useStore((state) => state.reset);
  const state_name = useStore(getStateName);
  const placement = useStore(getPlacementListSelector);

  const updateValidation = useStore(UpdateValidationSelector);
  const validationInstance = useStore((state) => state.validations);
  const [stateName, setStateName] = useState("");

  const handleValidationUpdate = () => {
    updateValidation();
  };

  useEffect(() => reset("default"), []);

  const [allValidationsValid, setAllValidationsValid] = useState(false);

  useEffect(() => {
    const checkAllValidations = () => {
      const allValid = validationInstance.every((validation) => {
        // console.log(validation)
        return validation.get_isValid()
      }
      );
      setAllValidationsValid(allValid);
    };

    checkAllValidations();
  }, [validationInstance]);

  const handleSaveState = async () => {
    if (stateName) {
      try {
        const currentState = useStore.getState();
        const response = await fetch('/api/supabase/DataBaseAPI', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stateName, state: currentState }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to save state');
        }
  
        alert(`State "${stateName}" saved successfully!`);
      } catch (error) {
        console.error("Error saving state:", error);
        alert("Error saving state. Please try again.");
      }
    } else {
      alert("Please enter a state name before saving.");
    }
  };
  
  const handleLoadState = async () => {
    if (stateName) {
      try {
        const response = await fetch(`/api/supabase/DataBaseAPI?stateName=${encodeURIComponent(stateName)}`);
  
        if (!response.ok) {
          throw new Error('Failed to load state');
        }
  
        const loadedState: Partial<State> = await response.json();
        // console.log(loadedState)
        useStore.setState(loadedState);
        alert(`State "${stateName}" loaded successfully!`);
      } catch (error) {
        console.error("Error loading state:", error);
        alert("Error loading state. Please try again.");
      }
    } else {
      alert("Please enter a state name to load.");
    }
  };

  return (
      <div className="flex flex-col md:flex-row h-screen bg-gray-100">
        {/* Main Three.js Experience */}
        <div className="flex-grow bg-black h-1/2 md:h-full md:flex-1">
          <Experience /> {/* Three.js experience */}
        </div>

        {/* Sidebar */}
        <div
          className="w-full md:w-1/3 md:min-w-[300px] md:max-w-md bg-blue-50 p-4 overflow-y-auto h-1/2 md:h-full"
          style={{ height: "100lvh" }}
        >
          <div className="space-y-4 md:space-y-6">
            <OrderHandler state_name={state_name} />

            {/* Add the ValidationComponent here */}
            <div className="mt-auto">
              <ValidationComponent
                validations={validationInstance}
                updater={handleValidationUpdate}
              />
            </div>
          </div>

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
  );
}
