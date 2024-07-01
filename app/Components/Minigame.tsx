"use client";
import React, { useState } from "react";
import Experience from "./visualexp";
import Link from "next/link";

import { useStore,setInteractobjvalueSelector, controlsSelector, InteraobjvalueSelector} from "../store"
import NumSlide from "./NumSlider";

export function Minigame({ page }: { page: number }) {
  const [text, setText] = useState("This is a test question? ");
  const setValue = useStore(setInteractobjvalueSelector);
  const getControl = useStore(controlsSelector); // selects based on control id
  const getValue = useStore(InteraobjvalueSelector); // selects based on object id


  const test_id: number = 1 // for testing remove soon

  return (
    <>
      <div
        className="border-solid border-2 border-blue-200 ..."
        style={{ width: "100vw", height: "80vh" }}
      >
        <Experience />
      </div>
      <div className="bg-blue-200 shadow-lg rounded-lg p-6 m-2">
        <div className="text-gray-700 text-lg">
          <p id="question-text"> {text}</p>
        </div>
        <div className="flex justify-end mt-4">
          <Link
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            href={`/${Number(page) + 1}`}
          >
            Next Question
          </Link>
        </div>

        <NumSlide control_id={1} />
        <NumSlide control_id={3} />
      </div>
    </>
  );
}
