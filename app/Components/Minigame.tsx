"use client";
import React, { useEffect, useState } from "react";
import Experience from "./visualexp";
import Link from "next/link";
import ShowControl from "./ShowControl";
import ShowScore from "./ShowScore";
import { useStore, getQuestionSelector, getStateName, getPlacementSelector, UpdateValidationSelector } from "../store";
import { initDataSets } from "@/classes/init_datasets";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { PlacementProvider, PlacementControl, PlacementActivationButton } from './three/PlacementControl';
import ShowPlacement from "./ShowPlacement";
import "./style.css";
import ValidationComponent from "./ShowValid";

export function Minigame({ page }: { page: keyof typeof initDataSets }) {
  // console.log("Page: ", page);
  const [resetInput, setResetInput] = useState("");
  const reset = useStore((state) => state.reset);
  const question: string = useStore(getQuestionSelector);
  const state_name = useStore(getStateName);
  const placement = useStore(getPlacementSelector);

  const test_id: number = 1; // for testing remove soon

  // testing
  const validationInstance = useStore((state) => state.validation);
  const updateValidation = useStore(UpdateValidationSelector);


  useEffect(() => {
    reset(page);
  }, []);

  const handleReset = () => {
    if (resetInput) {
      reset(resetInput);
      setResetInput(""); // Clear input after reset
    }
  };

  return (
    <PlacementProvider length={placement?.object_ids.length || 0}>
      <div className="flex flex-col md:flex-row h-screen bg-gray-100">
        {/* Main Three.js Experience */}
        <div className="flex-grow bg-black h-1/2 md:h-full md:flex-1">
          <Experience /> {/* Three.js experience */}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/3 md:min-w-[300px] md:max-w-md bg-blue-50 p-4 md:p-6 overflow-y-auto h-1/2 md:h-full">
          <div className="space-y-4 md:space-y-6">
            {/* Question */}
            <div className="bg-white rounded-lg shadow-md p-3 md:p-4">
              <h2 className="text-lg md:text-xl font-semibold text-blue-800 mb-2">
                Question:
              </h2>
              <p id="question-text" className="text-gray-700">
                <Latex> {question} </Latex>
              </p>
            </div>

            {/* Number Sliders */}
            <div className="space-y-3 md:space-y-4">
              <ShowScore score_id={1} />
            </div>

            {/* Show Selects */}
            <div className="space-y-3 md:space-y-4">
              {state_name ? initDataSets[state_name].controlData.map((control) => (
                <ShowControl control_id={control.id} key={control.id} />
              )) : null}
            </div>

            {placement ? <ShowPlacement /> : null}

            {/* Add the ValidationComponent here */}
            <ValidationComponent validation={validationInstance} updater={updateValidation} />
          </div>
        </div>
      </div>
    </PlacementProvider>
  );
}
