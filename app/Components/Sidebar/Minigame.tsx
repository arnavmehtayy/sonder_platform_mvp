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
import { CheckCircle } from 'lucide-react';

export function Minigame({
  experienceId,
  currentSlideIndex,
}: {
  experienceId: number;
  currentSlideIndex: number;
}) {
  const page = experiences[experienceId]?.slides[currentSlideIndex];
  const reset = useStore((state) => state.reset);
  const state_name = useStore(getStateName);
  const placement = useStore(getPlacementListSelector);
  const experience = experiences[experienceId];
  const updateValidation = useStore(UpdateValidationSelector);
  const validationInstance = useStore((state) => state.validations);
  const [showValidation, setShowValidation] = useState(true);
  const [allValidationsValid, setAllValidationsValid] = useState(false);

  useEffect(() => {
    if (page) {
      reset(page);
    }
  }, []);

  const handleValidationUpdate = () => {
    updateValidation();
  };

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

          {allValidationsValid && experience && (
            <div className="flex justify-between mt-6 gap-4">
              {currentSlideIndex > 0 && (
                <Link
                  href={`/experience/${experienceId}/${currentSlideIndex - 1}`}
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
        </div>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}