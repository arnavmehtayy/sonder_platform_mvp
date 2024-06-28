"use client";
import React, { useState } from "react";
import Experience from "./visualexp";
import Link from "next/link";

import { useStore, objectsSelector, setInteractobjvalueSelector, vizobjsSelector} from "../store"

export function Minigame({ page }: { page: number }) {
  const [text, setText] = useState("This is a test question? ");
  const setInteractobjvalue = useStore(setInteractobjvalueSelector);
  const objselector = useStore(vizobjsSelector);


  const test_id: number = 2 // for testing remove soon

  console.log(objselector(test_id).control?.value)

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

        <div
          className="flex justify-end"
          style={{ width: "300px", margin: "50px auto", textAlign: "center" }}
        >
          <input
            type="range"
            min = {objselector(test_id).control?.range[0].toString()}
            max= {objselector(test_id).control?.range[1].toString()}
            step={0.1}
            value={objselector(test_id).control?.value}
            onChange={(e) => setInteractobjvalue(test_id, Number(e.target.value))}
            style={{ width: "100%" }}
          />
          <p>Value: {objselector(test_id).control?.value}</p>
        </div>
      </div>
    </>
  );
}
