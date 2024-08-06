"use client";
import React, { useEffect, useState } from "react";
import Experience from "./visualexp";
import Link from "next/link";
import ShowControl from "./ShowControl";
import ShowScore from "./ShowScore";
import {
  useStore,
  getQuestionSelector,
  getStateName,
  getPlacementSelector,
  UpdateValidationSelector,
} from "../store";
import { initDataSets, experiences } from "@/classes/init_datasets";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import {
  PlacementProvider,
  PlacementControl,
  PlacementActivationButton,
} from "./three/PlacementControl";
import ShowPlacement from "./ShowPlacement";
import "./style.css";
import ValidationComponent from "./ShowValid";
import { useRouter } from "next/router";
import {FeedbackComponent} from "./MainMenu/FeedbackComponent";
import { controlData } from "@/classes/init_data";

export function Minigame({
  experienceId,
  currentSlideIndex,
}: {
  experienceId: number;
  currentSlideIndex: number;
}) {
  // console.log("Page: ", page);
  const page = experiences[experienceId - 1].slides[currentSlideIndex];
  const reset = useStore((state) => state.reset);
  const question: string = useStore(getQuestionSelector);
  const state_name = useStore(getStateName);
  const placement = useStore(getPlacementSelector);

  // const router = useRouter();
  const experience = experiences[experienceId - 1];
  const updateValidation = useStore(UpdateValidationSelector);
  const validationInstance = useStore((state) => state.validations);

  const handleValidationUpdate = () => {
    updateValidation();
  };


  const test_id: number = 1; // for testing remove soon
  // console.log(initDataSets[state_name].controlData)

  // testing

  // if(state_name) {
  // initDataSets[state_name].controlData
  // }
  

  useEffect(() => {
    reset(page);
  }, []);


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
            {/* Question */}
            <div className="bg-white rounded-lg shadow-md p-3 md:p-4">
              <h2 className="text-lg md:text-xl font-semibold text-blue-800 mb-2">
                Question:
              </h2>
              <p id="question-text" className="text-gray-700">
                <Latex> {question} </Latex>
              </p>
            </div>

            {/* Scores */}
            <div className="space-y-3 md:space-y-4">
              {state_name ? initDataSets[state_name].scoreData.map((score) => (
              <ShowScore key={score.score_id} score_id={score.score_id} />
              )) : null}
            </div>

            {/* Show Selects */}
            <div className="space-y-3 md:space-y-4">
              {state_name
                ? initDataSets[state_name].controlData.map((control) => (
                    <ShowControl control_id={control.id} key={control.id} />
                  ))
                : null}
                
            </div>

            {placement ? <ShowPlacement /> : null}

            {/* Add the ValidationComponent here */}
            <div className="mt-auto">
              <ValidationComponent
                validations={validationInstance}
                updater={handleValidationUpdate}
              />
              {validationInstance.every(v => v.is_valid) && (
                <Link
                  href={
                    currentSlideIndex < experience.slides.length - 1
                      ? `/experience/${experienceId}/${currentSlideIndex + 1}`
                      : `/experience/thank-you/${experienceId}`
                  }
                  className="block w-full mt-4 px-4 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  {currentSlideIndex < experience.slides.length - 1
                    ? "Next"
                    : "Done"}
                </Link>
              )}
            </div>
            <br />
            <br />
            <br />
          </div>
        </div>
      </div>
    </PlacementProvider>
  );
}
