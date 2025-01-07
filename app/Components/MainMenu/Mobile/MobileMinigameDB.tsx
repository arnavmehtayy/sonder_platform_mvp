"use client";
import { useState, useEffect } from "react";
import {
  useStore,
  getIsVideoEndedSelector,
  getIsVideoPlayingSelector,
  UpdateValidationSelector,
} from "@/app/store";
import { MobileVideoPlayer } from "./VideoPlayerMobile";
import { OrderHandlerDB } from "../../Sidebar/OrderHandlerDB";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, CheckCircle, FastForward } from "lucide-react";
import Link from "next/link";
import { MobileValidation } from "./MobileValidation";

interface MobileMinigameDBProps {
  experienceID: number;
  index: number;
}

export function MobileMinigameDB({
  experienceID,
  index,
}: MobileMinigameDBProps) {
  const isVideoEnded = useStore(getIsVideoEndedSelector);
  const isVideoPlaying = useStore(getIsVideoPlayingSelector);
  const [showQuestions, setShowQuestions] = useState(false);
  const updateValidation = useStore(UpdateValidationSelector);
  const validationInstance = useStore((state) => state.validations);
  const [showValidationResults, setShowValidationResults] = useState(false);
  const [allValidationsValid, setAllValidationsValid] = useState(false);
  const [hasNextExperience, setHasNextExperience] = useState(false);

  // Show questions panel when video ends
  useEffect(() => {
    if (isVideoEnded) {
      setShowQuestions(true);
    } else {
      setShowQuestions(false);
      // Reset validation results when video starts
      setShowValidationResults(false);
    }
  }, [isVideoEnded, isVideoPlaying, experienceID, index]);

  // Check for validations
  useEffect(() => {
    const checkAllValidations = () => {
      const allValid = validationInstance.every((validation) =>
        validation.get_isValid()
      );
      setAllValidationsValid(allValid);
    };
    checkAllValidations();
  }, [validationInstance]);

  // Check for next experience
  useEffect(() => {
    const checkNextExperience = async () => {
      try {
        const response = await fetch(
          `/api/supabase/check-next?experienceId=${experienceID}&index=${
            index + 1
          }`
        );
        const data = await response.json();
        setHasNextExperience(data.hasNext);
      } catch (error) {
        console.error("Error checking next experience:", error);
        setHasNextExperience(false);
      }
    };

    checkNextExperience();
  }, [experienceID, index]);

  const handleValidationUpdate = () => {
    updateValidation();
    setShowValidationResults(true);
  };

  return (
    <div className="relative h-full w-full">
      {/* Video Section */}
      <div
        className={`w-full ${
          showQuestions ? "h-1/2" : "h-full"
        } transition-all duration-500`}
      >
        <MobileVideoPlayer experienceId={experienceID} index={index} />
      </div>

      {/* Questions Panel */}
      <AnimatePresence>
        {showQuestions && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-white rounded-t-3xl overflow-hidden shadow-2xl"
          >
            <div className="h-full overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+4rem)]">
              {/* Pull indicator */}
              <div className="sticky top-0 w-full bg-white pt-2 pb-4 flex justify-center z-10">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>

              {/* Content */}
              <div className="px-4 space-y-6">
                <OrderHandlerDB />

                {/* Validation Results */}
                <MobileValidation
                  validations={validationInstance}
                  showResults={showValidationResults}
                />

                {/* Verify button */}
                {validationInstance.length > 0 && (
                  <button
                    onClick={handleValidationUpdate}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-xl shadow-md 
                             transition-all duration-300 hover:bg-green-700 hover:shadow-lg 
                             active:bg-green-800"
                  >
                    <span className="text-lg font-semibold">
                      Verify Answers
                    </span>
                  </button>
                )}

                {/* Success Message */}
                {allValidationsValid && (
                  <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-100 rounded-full p-1">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="text-green-800 font-semibold">
                        Great work!
                      </h3>
                    </div>
                    <p className="text-green-600 text-sm ml-9">
                      {hasNextExperience
                        ? "Move on to the next video"
                        : "You've completed this module!"}
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mb-safe">
                  {index > 0 && (
                    <Link
                      href={`/experience/data/${experienceID}/${index - 1}`}
                      className="flex-1 bg-blue-600 px-4 py-3 rounded-xl text-white text-center 
                               font-semibold shadow-md hover:bg-blue-700 active:bg-blue-800 
                               transition-all duration-300"
                    >
                      Previous
                    </Link>
                  )}
                  <Link
                    href={
                      hasNextExperience
                        ? `/experience/data/${experienceID}/${index + 1}`
                        : "/"
                    }
                    className={`flex-1 px-4 py-3 rounded-xl text-white text-center 
                              font-semibold shadow-md transition-all duration-300
                              ${
                                allValidationsValid
                                  ? "bg-green-600 hover:bg-green-700 active:bg-green-800"
                                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                              }`}
                  >
                    {hasNextExperience ? "Next Challenge" : "Home Page"}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
