"use client";
import React, { useEffect, useState } from "react";
import Experience from "../visualexp";
import Link from "next/link";
import {
  useStore,
  getStateName,
  getPlacementSelector,
  UpdateValidationSelector,
  getPlacementListSelector,
} from "@/app/store";
import { experiences } from "@/classes/Data/CompleteData";
import "katex/dist/katex.min.css";
import "../style.css";
import ValidationComponent from "../ShowValid";
import { OrderHandler } from "./OrderHandler";

/*
 * This component is the main component for the minigame. It is responsible for rendering the Three.js experience and the sidebar.
 */

export function Minigame({
  experienceId,
  currentSlideIndex,
}: {
  experienceId: number;
  currentSlideIndex: number;
}) {
  const page = experiences[experienceId]?.slides[currentSlideIndex]; // gets the relevant name of the slide as stored in the CompleteData
  const reset = useStore((state) => state.reset);
  const state_name = useStore(getStateName);
  const placement = useStore(getPlacementListSelector);

  const experience = experiences[experienceId];
  const updateValidation = useStore(UpdateValidationSelector);
  const validationInstance = useStore((state) => state.validations);

  const handleValidationUpdate = () => {
    updateValidation();
  };

  useEffect(() => {
    // reset the zustand state when the component is mounted to the relevant page
    if (page) {
      reset(page);
    }
  }, []);

  const [allValidationsValid, setAllValidationsValid] = useState(false);

  useEffect(() => {
    const checkAllValidations = () => {
      const allValid = validationInstance.every((validation) =>
        validation.get_isValid()
      );
      setAllValidationsValid(allValid);
    };

    checkAllValidations();
  }, [validationInstance]); // if validationInstance changes, check if all validations are valid

  return (
    // this is the context provider for the placement system
    
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
            {/* This returns all the sidebar components */}
            <OrderHandler state_name={state_name} />

            {/* ValidationComponent */}
            <div className="mt-auto">
              <ValidationComponent
                validations={validationInstance}
                updater={handleValidationUpdate}
              />
              {allValidationsValid && experience && (
                <div className="flex justify-between mt-6 gap-4">
                  {currentSlideIndex > 0 && (
                    <Link
                      href={`/experience/${experienceId}/${
                        currentSlideIndex - 1
                      }`}
                      className={`flex-1 group relative overflow-hidden rounded-lg bg-blue-600 px-4 py-3 text-white shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg active:bg-blue-800`}
                    >
                      <span className="relative z-10 flex items-center justify-center text-lg font-semibold">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Previous
                      </span>
                    </Link>
                  )}
                  <Link
                    href={
                      currentSlideIndex < experience.slides.length - 1
                        ? `/experience/${experienceId}/${currentSlideIndex + 1}`
                        : `/experience/thank-you/${experienceId}`
                    }
                    className={`flex-1 group relative overflow-hidden rounded-lg bg-blue-600 px-4 py-3 text-white shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg active:bg-blue-800`}
                  >
                    <span className="relative z-10 flex items-center justify-center text-lg font-semibold">
                      {currentSlideIndex < experience.slides.length - 1 ? (
                        <>
                          Next
                          <svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </>
                      ) : (
                        "Done"
                      )}
                    </span>
                  </Link>
                </div>
              )}
              {/* if all validations are valid, show the next button to go to the next slide or the done button if it is the last slide  */}
            </div>
          </div>

          <br />
          <br />
          <br />
        </div>
      </div>
    
  );
}
