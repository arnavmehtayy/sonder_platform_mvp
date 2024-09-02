import React, { useState } from "react";
import {
  getControlSelector,
  useStore,
  setMultiChoiceOptionsSelector,
} from "../../store";
import { MultiChoiceClass } from "@/classes/Controls/MultiChoiceClass";
import Latex from "react-latex-next";

/*
  Given a control_id for a MultiChoiceClass generates the UI for the control
  this generates a multiple choice question with a list of options that the user can choose from

*/

export interface Option {
  id: number;
  label: string;
}

export default function MultiChoice({ control_id }: { control_id: number }) {
  const control = useStore(getControlSelector(control_id)) as MultiChoiceClass;
  const setSelectedOptions = useStore(setMultiChoiceOptionsSelector);
  const selectedOptions = (
    useStore((state) => state.controls[control_id]) as MultiChoiceClass
  ).selectedOptions;

  const title = control.desc;
  const description = control.text;
  const options = control.options;
  const isMultiSelect = control.isMultiSelect; // can select multiple options
  const isClickable = control.isClickable; // if the control can be interacted with

  const handleOptionClick = (optionId: number) => {
    if (!isClickable) return;
    let new_options = [] as number[];
    if (isMultiSelect) {
      new_options = selectedOptions.includes(optionId)
        ? selectedOptions.filter((id) => id !== optionId)
        : [...selectedOptions, optionId]; // add the option to the list of selected options
    } else {
      new_options = [optionId]; // if it is not a multi select then only one option can be selected
    }

    setSelectedOptions(control_id, new_options);
  };

  return (
    // the UI for the MultiChoice control and its surrounding box and text
    <div
      className={`bg-white rounded-lg shadow-lg p-6 ${
        !isClickable ? "opacity-70" : ""
      }`}
    >
      <h3 className="text-lg font-semibold text-blue-800 mb-2">
        <Latex>{title}</Latex>
      </h3>
      <p className="text-gray-600 mb-2">
        <Latex>{description}</Latex>
      </p>
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            disabled={!isClickable}
            className={`
              w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ease-in-out
              ${
                selectedOptions.includes(option.id)
                  ? "bg-blue-800 text-white shadow-md transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
              ${
                !isClickable
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:shadow-md"
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            `}
          >
            <div className="flex items-center">
              <div
                className={`
                w-5 h-5 mr-3 rounded-full border-2 flex-shrink-0
                ${
                  selectedOptions.includes(option.id)
                    ? "border-white bg-white"
                    : "border-blue-500 bg-transparent"
                }
              `}
              >
                {selectedOptions.includes(option.id) && (
                  <svg
                    className="w-3 h-3 text-blue-500 mx-auto mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text">
                {" "}
                <Latex>{option.label}</Latex>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
