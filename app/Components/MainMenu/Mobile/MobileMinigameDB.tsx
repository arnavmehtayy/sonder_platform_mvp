"use client";
import { useState, useEffect, useRef } from "react";
import {
  useStore,
  getIsVideoEndedSelector,
  getIsVideoPlayingSelector,
  UpdateValidationSelector,
} from "@/app/store";
import { MobileVideoPlayer } from "./VideoPlayerMobile";
import { OrderHandlerDB } from "../../Sidebar/OrderHandlerDB";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, CheckCircle, FastForward, XCircle } from "lucide-react";
import Link from "next/link";
import { MobileValidation } from "./MobileValidation";
import Experience from "../../visualexp";

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
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const questionsRef = useRef<HTMLDivElement>(null);

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

  // Add scroll listener to hide indicator when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (showScrollIndicator) {
        setShowScrollIndicator(false);
      }
    };

    const questionsPanel = questionsRef.current;
    if (questionsPanel) {
      questionsPanel.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (questionsPanel) {
        questionsPanel.removeEventListener("scroll", handleScroll);
      }
    };
  }, [showScrollIndicator]);

  const handleValidationUpdate = () => {
    updateValidation();
    setShowValidationResults(true);
    setShowScrollIndicator(true);
  };

  const scrollToValidationResults = () => {
    document.getElementById("validation-results")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div className="relative h-full w-full">
      {/* Video Section */}
      <div
        className={`w-full ${
          showQuestions ? "h-[30%]" : "h-full"
        } transition-all duration-500 relative`}
      >
        <MobileVideoPlayer experienceId={experienceID} index={index} />

        {/* Add Three.js experience layer */}
        {isVideoEnded && (
          <div className="absolute inset-0 w-full h-full">
            <Experience />
          </div>
        )}
      </div>

      {/* Questions Panel */}
      <AnimatePresence>
        {showQuestions && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 h-[70%] bg-white rounded-t-3xl overflow-hidden shadow-2xl"
          >
            <div
              ref={questionsRef}
              className="h-full overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+4rem)]"
            >
              {/* Pull indicator */}
              <div className="sticky top-0 w-full bg-white pt-2 pb-4 flex justify-center z-10">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>

              {/* Content */}
              <div className="px-4 space-y-6">
                <OrderHandlerDB />

                {/* Validation Results */}
                <div id="validation-results">
                  <MobileValidation
                    validations={validationInstance}
                    showResults={showValidationResults}
                  />
                </div>

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
                  {hasNextExperience && (
                    <Link
                      href={`/experience/data/${experienceID}/${index + 1}`}
                      className={`flex-1 px-4 py-3 rounded-xl text-white text-center 
                                font-semibold shadow-md transition-all duration-300
                                ${
                                  allValidationsValid
                                    ? "bg-green-600 hover:bg-green-700 active:bg-green-800"
                                    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                                }`}
                    >
                      Next Challenge
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Floating Scroll Indicator */}
            <AnimatePresence>
              {showScrollIndicator && showValidationResults && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-[40%] bottom-24 transform -translate-x-1/2 z-20"
                  onClick={scrollToValidationResults}
                >
                  <div
                    className="bg-black bg-opacity-40 rounded-full p-4 cursor-pointer
                                hover:bg-opacity-60 transition-all duration-300 shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Smart Verify Button */}
            {validationInstance.length > 0 && (
              <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-md">
                <button
                  onClick={handleValidationUpdate}
                  className={`w-full px-4 py-3 rounded-xl text-white font-semibold shadow-md 
                            transition-all duration-300 flex items-center justify-center gap-2
                            ${
                              showValidationResults
                                ? allValidationsValid
                                  ? "bg-green-600 hover:bg-green-700 active:bg-green-800"
                                  : "bg-amber-600 hover:bg-amber-700 active:bg-amber-800"
                                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                            }`}
                >
                  {showValidationResults ? (
                    <>
                      {allValidationsValid ? (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          <span>All Correct!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5" />
                          <span>
                            {
                              validationInstance.filter((v) => v.get_isValid())
                                .length
                            }{" "}
                            of {validationInstance.length} Correct - Try Again!
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    <span>Verify Answers</span>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
