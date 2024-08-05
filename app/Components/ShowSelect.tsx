import React, { useEffect, useState } from "react";
import {
  useStore,
  getControlSelector,
  DeSelectObjectControl,
  SetIsActiveControl,
  getNameSelector
} from "@/app/store";
import { SelectControl } from "@/classes/SelectControl";

export function ShowSelect({ control, control_id }: { control: SelectControl, control_id: number }) {
  const handleRemove = useStore(DeSelectObjectControl);
  const setIsActive = useStore(SetIsActiveControl(control_id));
  const getName = useStore(getNameSelector);
  const [isDark, setIsDark] = useState(control.isActive);

  useEffect(() => {
    setIsActive(isDark);
  }, [isDark]);

  useEffect(() => {
    if (control.selected.length >= control.capacity) {
      setIsDark(false);
      setIsActive(false);
    }
  }, [control.selected.length, control.capacity]);

  const handleClick = () => {
    const newState = !isDark;
    setIsDark(newState);
    setIsActive(newState);
  };

  if (control) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-800">{control.desc}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {control.selected.length}/{control.capacity} selected
              </span>
              <button
                onClick={handleClick}
                className={`${
                  isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 hover:bg-gray-500"
                } text-white py-1 px-3 rounded-md text-sm font-medium transition duration-300 ease-in-out`}
              >
                {isDark ? "Active" : "Inactive"}
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {control.text}
          </p>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {control.selected.map((id) => (
            <div
              key={id}
              className="relative flex items-center justify-center p-3 bg-blue-100 rounded-md shadow-sm hover:shadow-md transition duration-300"
            >
              <button
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-300 shadow-sm"
                onClick={() => handleRemove(id, control_id)}
                aria-label="Remove item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="text-blue-800 font-medium truncate">{getName(id)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return null;
  }
}