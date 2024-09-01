"use client";
import React, { useEffect, useState } from "react";
import Experience from "../visualexp";
import Link from "next/link";
import ShowControl from "../ShowControls/ShowControl";
import ShowScore from "../ShowScore";
import {
  useStore,
  getStateName,
  getPlacementSelector,
  UpdateValidationSelector,
} from "@/app/store";
import { initDataSets, experiences } from "@/classes/Data/CompleteData";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import {
  PlacementProvider,
  PlacementControl,
  PlacementActivationButton,
} from "../three/PlacementControl";
import ShowPlacement from "../ShowPlacement";
import "../style.css";
import ValidationComponent from "../ShowValid";
import { useRouter } from "next/router";
import { FeedbackComponent } from "../MainMenu/FeedbackComponent";
import MultiChoice from "../ShowControls/ShowMultiChoice";
import ShowInputNumber from "../ShowControls/ShowInputNumber";
import { OrderHandler, OrderItem } from "./OrderHandler";
import { Instance } from "@react-three/drei";

export function Minigame({
  experienceId,
  currentSlideIndex,
}: {
  experienceId: number;
  currentSlideIndex: number;
}) {
  // console.log("Page: ", page);
  const page = experiences[experienceId]?.slides[currentSlideIndex];
  const reset = useStore((state) => state.reset);
  const state_name = useStore(getStateName);
  const placement = useStore(getPlacementSelector);

  // const router = useRouter();
  const experience = experiences[experienceId];
  const updateValidation = useStore(UpdateValidationSelector);
  const validationInstance = useStore((state) => state.validations);

  const handleValidationUpdate = () => {
    updateValidation();
  };

  const test_id: number = 1; // for testing remove soon
  const componentOrder: OrderItem[] = [
    { type: "question", id: 0 },
    { type: "score", id: 2 },
    { type: "control", id: 1 },
    { type: "control", id: 2 },
    { type: "placement", id: 0 },
    { type: "question", id: 1 },
    { type: "score", id: 1 },
  ];
  // console.log(initDataSets[state_name].controlData)

  // testing

  // if(state_name) {
  // initDataSets[state_name].controlData
  // }

  useEffect(() => {
    if(page) {
    reset(page);
    }
  }, []);

  const [allValidationsValid, setAllValidationsValid] = useState(false);

  useEffect(() => {
    const checkAllValidations = () => {
      const allValid = validationInstance.every(validation => validation.get_isValid());
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
        {allValidationsValid && experience &&(
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
          </div>

          <br />
          <br />
          <br />
        </div>
      </div>
    </PlacementProvider>
  );
}
