"use client";
import React, { useState } from "react";
import Experience from "./visualexp";
import Link from "next/link";
import NumSlide from "./NumSlider";
import { ShowSelect } from "./ShowSelect";
import ShowScore from "./ShowScore";

/*
 * This component is the main user experience component.
 * It displays the visual experience (three.js) and the question for the user to answer
 * The user can interact with the visual experience and answer the question
 * It uses the NumSlide component to display the number slider for interactivity
 */

export function Minigame({ page }: { page: number }) {
  console.log("Page: ", page);
  const [text, setText] = useState("This is a test question? ");

  const test_id: number = 1; // for testing remove soon

  return (
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
            <h2 className="text-lg md:text-xl font-semibold text-blue-800 mb-2">Question:</h2>
            <p id="question-text" className="text-gray-700">{text}</p>
          </div>
          
          {/* Number Sliders */}
          <div className="space-y-3 md:space-y-4">
            <NumSlide control_id={1} />
            <NumSlide control_id={2} />
            <NumSlide control_id={3} />
            <ShowScore score_id={1} text="MSE: " />
          </div>
          
          {/* Show Selects */}
          <div className="space-y-3 md:space-y-4">
            <ShowSelect control_id={4} />
            <ShowSelect control_id={5} />
          </div>
          
          {/* Next Question Button */}
          <div className="mt-4 md:mt-6">
            <Link
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center text-sm md:text-base"
              href={`/${Number(page) + 1}`}
            >
              Next Question
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
