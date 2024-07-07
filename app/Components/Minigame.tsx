"use client";
import React, { useState } from "react";
import Experience from "./visualexp";
import Link from "next/link";
import NumSlide from "./NumSlider";

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
    <>
      <div
        className="border-solid border-2 border-blue-200 ..."
        style={{ width: "100vw", height: "80vh" }}
      >
        <Experience /> {/* creating the three.js experience to be displayed */}
      </div>
      <div className="bg-blue-200 shadow-lg rounded-lg p-6 m-2">
        <div className="text-gray-700 text-lg">
          <p id="question-text"> {text}</p>
        </div>
        <div className="flex justify-end mt-4">
          <Link
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            href={`/${Number(page) + 1}`} // Link to the Next page in this case just for testing
          >
            Next Question
          </Link>
        </div>
        <NumSlide control_id={1} />
        {/* Number slider for interactivity using the control_id */}
        <NumSlide control_id={3} />
      </div>
    </>
  );
}
