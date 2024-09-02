import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

/*
  TutorialOverlay is a component that provides a tutorial overlay for the user to learn how to use the application.
  It provides a step-by-step guide to the user on how to use the application.
*/

export const TutorialOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Move the visual",
      description: "Click and drag to move the camera in any direction.",
      animation: "move-hand",
    },
    {
      title: "Zoom in and out",
      description: "Scroll to zoom in and out of the experience.",
      animation: "pinch-hand",
    },
    {
      title: "Scroll the sidebar",
      description: "Scroll down on the sidebar to see more information.",
      animation: "scroll-hand",
    },
  ];

  const handleNext = () => {
    setStep(step + 1);
  };

  return (
    <>
      {step < steps.length ? (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 pointer-events-none">
          <div className={`hand ${steps[step].animation}`} />{" "}
          {/* the hand animation that is overlayed on the screen */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg max-w-sm pointer-events-auto">
            <h3 className="text-lg font-semibold mb-2">{steps[step].title}</h3>
            <p className="text-sm mb-4">{steps[step].description}</p>
            <button
              onClick={handleNext}
              className="flex items-center justify-center w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              {step < steps.length - 1 ? "Next" : "Got it!"}
              <ChevronRight className="ml-2" size={18} />
            </button>
          </div>{" "}
          {/* the bottom dialogue that instructs the user*/}
        </div>
      ) : null}
    </>
  );
};

export default TutorialOverlay;
