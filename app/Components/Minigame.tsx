"use client";
import React, { useEffect, useState } from "react";
import Experience from "./visualexp";
import Link from "next/link";
import ShowControl from "./ShowControl";
import ShowScore from "./ShowScore";
import {
  useStore,
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
import { FeedbackComponent } from "./MainMenu/FeedbackComponent";
import { controlData } from "@/classes/init_data";
import MultiChoice from "./MultiChoice";
import ShowInputNumber from './ShowInputNumber'
import {OrderHandler, OrderItem} from "./OrderHandler";

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
  const componentOrder: OrderItem[] = [
    { type: 'question', id: 0 },
    { type: 'score', id: 2 },
    { type: 'control', id: 1 },
    { type: 'control', id: 2 },
    { type: 'placement', id: 0 },
    { type: 'question', id: 1 },
    { type: 'score', id: 1 },
  ];
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
          <OrderHandler
            state_name= {state_name}
          />

            {/* Add the ValidationComponent here */}
            <div className="mt-auto">
              <ValidationComponent
                validations={validationInstance}
                updater={handleValidationUpdate}
              />
              {validationInstance.every((v) => v.is_valid) && (
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
            </div>



            

            
            <br />
            <br />
            <br />
            
          </div>
        </div>
    </PlacementProvider>
  );
}
