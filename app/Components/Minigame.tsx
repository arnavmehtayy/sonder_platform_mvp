"use client";
import React, { useState } from "react";
import Experience from "./visualexp";
import Link from "next/link";
import ShowControl from "./ShowControl";
import ShowScore from "./ShowScore";
import { useStore, getQuestionSelector, getStateName, getPlacementSelector} from "../store";
import { initDataSets } from "@/classes/init_datasets";

import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { PlacementProvider, PlacementControl, PlacementActivationButton} from './three/PlacementControl'
import ShowPlacement from "./ShowPlacement";

/*
 * This component is the main user experience component.
 * It displays the visual experience (three.js) and the question for the user to answer
 * The user can interact with the visual experience and answer the question
 * It uses the NumSlide component to display the number slider for interactivity
 */

export function Minigame({ page }: { page: number }) {
  console.log("Page: ", page);
  const [resetInput, setResetInput] = useState("");
  const reset = useStore((state) => state.reset);
  const question: string = useStore(getQuestionSelector);
  const state_name = useStore(getStateName);
  const placement = useStore(getPlacementSelector);

//   const latexText = `
//   \\[
//   \\begin{aligned}
//     \\text{Find the value of } & \\int_0^1 x^2 \\, dx: \\\\
//     \\int_0^1 x^2 \\, dx & = \\left[ \\frac{x^3}{3} \\right]_0^1 \\\\
//     & = \\frac{1}{3}
//   \\end{aligned}
//   \\]
// `;

  const test_id: number = 1; // for testing remove soon

  const handleReset = () => {
    if (resetInput) {
      reset(resetInput); // Cast to keyof typeof initDataSets
      setResetInput(""); // Clear input after reset
    }
  };

  return (
    <PlacementProvider>
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Main Three.js Experience */}
      <div className="flex-grow bg-black h-1/2 md:h-full">
      
        <Experience /> {/* Three.js experience */}
      
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-1/3 md:min-w-[300px] md:max-w-md bg-blue-50 p-4 md:p-6 overflow-y-auto">
        <div className="space-y-4 md:space-y-6">
          {/* Question */}
          <div className="bg-white rounded-lg shadow-md p-3 md:p-4">
            <h2 className="text-lg md:text-xl font-semibold text-blue-800 mb-2">
              Question:
            </h2>
            <p id="question-text" className="text-gray-700">
              {" "}
              <Latex> {question} </Latex>{" "}
            </p>
          </div>

          {/* Number Sliders */}
          <div className="space-y-3 md:space-y-4">
            {/* <ShowControl control_id={1} />
            <ShowControl control_id={2} />
            <ShowControl control_id={3} /> */}
            <ShowScore score_id={1} />
          </div>

          {/* Show Selects */}
          <div className="space-y-3 md:space-y-4">
            { state_name ? initDataSets[state_name].controlData.map((control) => (<ShowControl control_id={control.id} key={control.id} />)) : null }
          {/* <ShowControl control_id={4} />
          <ShowControl control_id={5} /> */}
          </div>

          {placement ? <ShowPlacement /> : null}
          {/* Reset State Input and Button */}
          <div className="mt-4 md:mt-6 flex items-center space-x-2">
            <input
              type="text"
              value={resetInput}
              onChange={(e) => setResetInput(e.target.value)}
              placeholder="Enter state name"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-blue placeholder-gray-400"
            />
            <button
              onClick={handleReset}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center text-sm md:text-base"
            >
              Reset State
            </button>
          </div>
          
          
          
        </div>
      </div>
    </div>
    </PlacementProvider>
  );
}
