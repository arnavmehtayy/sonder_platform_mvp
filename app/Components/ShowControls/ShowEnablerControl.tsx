import { EnablerControl } from "@/classes/Controls/EnablerControl";
import { useStore, getControlSelector, setEnablerControl } from "../../store";
import { useState, useRef, useEffect } from "react";
import Latex from "react-latex-next";

export function ShowEnablerControl({ control_id }: { control_id: number }) {
  const control = useStore(getControlSelector(control_id)) as EnablerControl;
  const isActive = control.isClickable;
  const [isComponentActive, setIsComponentActive] = useState(
    control.ControlState
  );
  const setIsActive = useStore(setEnablerControl(control_id));
  const [hasBeenClicked, setHasBeenClicked] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    setIsComponentActive((old) => !old);
    setIsActive(!isComponentActive);
    setHasBeenClicked(true);
  };

  const handleMouseEnter = () => {
    if (!hasBeenClicked) {
      setIsHovering(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (!hasBeenClicked) {
      timeoutRef.current = setTimeout(() => setIsHovering(false), 300);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (control) {
    return (
      <div
        className={`bg-white rounded-lg shadow-md p-4 mb-6 ${
          !isActive ? "opacity-50" : ""
        } relative`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-800">
            <Latex> {control.desc} </Latex>
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
                  ${isHovering && !hasBeenClicked && "motion-safe:animate-bounce"}
                  text-white py-1 px-3 rounded-md text-sm font-medium 
                  transition duration-300 ease-in-out
                  flex items-center
                `}
              >
                {isComponentActive ? "Deactivate" : "Click Here!"}
              </button>
            </div>
          </div>
          <p className="text-gray-600"> <Latex> {control.text} </Latex></p>
        </div>
      </div>
    );
  } else {
    return null;
  }
}