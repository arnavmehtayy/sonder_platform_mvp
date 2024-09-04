"use client";
import React, { useEffect, useState } from "react";
import Experience from "../visualexp";

import {
  useStore,
  getStateName,
  getPlacementSelector,
  UpdateValidationSelector,
} from "@/app/store";

import "katex/dist/katex.min.css";
import { PlacementProvider } from "../three/PlacementControl";
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
  const placement = useStore(getPlacementSelector);

  const updateValidation = useStore(UpdateValidationSelector);
  const validationInstance = useStore((state) => state.validations);

  const handleValidationUpdate = () => {
    updateValidation();
  };

  useEffect(() => reset("default"), []);

  const [allValidationsValid, setAllValidationsValid] = useState(false);

  useEffect(() => {
    const checkAllValidations = () => {
      const allValid = validationInstance.every((validation) =>
        validation.get_isValid()
      );
      setAllValidationsValid(allValid);
    };

    checkAllValidations();
  }, [validationInstance]);

  return (
    <PlacementProvider length={placement?.object_ids.length || 0}>
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
        </div>
      </div>
    </PlacementProvider>
  );
}
