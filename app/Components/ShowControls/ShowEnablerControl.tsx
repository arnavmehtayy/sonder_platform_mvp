import { EnablerControl } from "@/classes/Controls/EnablerControl";
import { useStore, getControlSelector, setEnablerControl } from "../../store";
import { useEffect, useState } from "react";

/*
 * Create a element of the sidebar which contains a button which when clicked makes the relevant vizobjs visible
*/

export function ShowEnablerControl({ control_id }: { control_id: number }) {
  const control = useStore(getControlSelector(control_id)) as EnablerControl;
  const isActive = control.isClickable;
  const [isComponentActive, setIsComponentActive] = useState(
    control.ControlState
  );
  const setIsActive = useStore(setEnablerControl(control_id));

  const handleClick = () => {
    setIsComponentActive((old) => !old);
    setIsActive(!isComponentActive);
  };

  if (control) {
    return (
      <div
        className={`bg-white rounded-lg shadow-md p-4 mb-6 ${
          !isActive ? "opacity-50" : ""
        } relative`}
      >
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-800">
              {control.desc}
            </h3>
            <div className="flex items-center space-x-2">
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
          <p className="text-gray-600">{control.text}</p>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
