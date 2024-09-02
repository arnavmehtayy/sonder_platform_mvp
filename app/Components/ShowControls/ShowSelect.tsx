import React, { useEffect, useState } from "react";
import {
  useStore,
  getControlSelector,
  DeSelectObjectControl,
  SetIsActiveSelectControl,
  getNameSelector
} from "@/app/store";
import { SelectControl } from "@/classes/Controls/SelectControl";
import Latex from "react-latex-next";

// Define the isEnabled variable at the top

export function ShowSelect({ control_id }: { control_id: number }) {
  
  const handleRemove = useStore(DeSelectObjectControl);
  const setIsActive = useStore(SetIsActiveSelectControl(control_id));
  const getName = useStore(getNameSelector);
  const control = useStore(getControlSelector(control_id)) as SelectControl;
  const isActive = control.isClickable;
  const [isComponentActive, setIsComponentActive] = useState(isActive && control.isActive);


  useEffect(() => {
    setIsActive(isComponentActive);
  }, [isComponentActive]);

  useEffect(() => {
    if (control.selected.length >= control.capacity) {
      setIsComponentActive(false);
      setIsActive(false);
    }
  }, [control.selected.length, control.capacity]);

  const handleClick = () => {
    if (isActive) {
      const newState = !isComponentActive;
      setIsComponentActive(newState);
      setIsActive(newState);
    }
  };

  if (control) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 mb-6 ${!isActive ? 'opacity-50' : ''} relative`}>
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-800"> <Latex>{control.desc}</Latex></h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {control.selected.length}/{control.capacity} selected
              </span>
              <button
                onClick={handleClick}
                disabled={!isActive}
                className={`
                  ${
                    isComponentActive
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 hover:bg-gray-500"
                  }
                  ${!isActive && "opacity-50 cursor-not-allowed"}
                  text-white py-1 px-3 rounded-md text-sm font-medium transition duration-300 ease-in-out
                  flex items-center
                `}
              >
                
                {isComponentActive ? "Active" : "Inactive"}
              </button>
            </div>
          </div>
          <p className="text-gray-600"><Latex>{control.text}</Latex></p>
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
                disabled={!isActive}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
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