"use client";
import React, { useState, useEffect, useRef } from "react";
import Experience from "../visualexp";
import Link from "next/link";
import {
  useStore,
  getStateName,
  getPlacementSelector,
  UpdateValidationSelector,
  getPlacementListSelector,
  getIsVideoPlayingSelector,
  getIsVideoEndedSelector,
} from "@/app/store";
import { experiences } from "@/classes/Data/CompleteData";
import "katex/dist/katex.min.css";
import "../style.css";
import { OrderHandler } from "./OrderHandler";
import {
  CheckCircle,
  ChevronDown,
  ArrowRight,
  FastForward,
} from "lucide-react";
import { OrderHandlerDB } from "./OrderHandlerDB";
import { VideoPlayer } from "../MainMenu/VideoPlayer";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@vercel/analytics";
import { MobileValidation } from "../MainMenu/Mobile/MobileValidation";

export function MinigameDB({
  experienceID,
  index,
}: {
  experienceID: number;
  index: number;
}) {
  const state_name = useStore(getStateName);
  const updateValidation = useStore(UpdateValidationSelector);
  const validationInstance = useStore((state) => state.validations);
  const [showValidationResults, setShowValidationResults] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const isVideoPlaying = useStore(getIsVideoPlayingSelector);
  const isVideoEnded = useStore(getIsVideoEndedSelector);
  const [allValidationsValid, setAllValidationsValid] = useState(false);
  const [hasNextExperience, setHasNextExperience] = useState(false);

  const handleValidationUpdate = () => {
    updateValidation();
    setShowValidationResults(true);
  };

  useEffect(() => {
    const checkAllValidations = () => {
      const allValid = validationInstance.every((validation) =>
        validation.get_isValid()
      );
      setAllValidationsValid(allValid);
    };
    checkAllValidations();
  }, [validationInstance]);

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

  useEffect(() => {
    if (hasNextExperience) {
      const preloadVideo = async () => {
        try {
          await fetch(
            `/api/supabase/video?experienceId=${experienceID}&index=${
              index + 1
            }`,
            {
              priority: "low",
            }
          );
        } catch (error) {
          console.error("Error preloading next video:", error);
        }
      };

      preloadVideo();
    }
  }, [experienceID, index, hasNextExperience]);

  useEffect(() => {
    const sidebar = sidebarRef.current;

    const checkInitialScroll = () => {
      if (sidebar) {
        const isScrollable = sidebar.scrollHeight > sidebar.clientHeight;
        setShowScrollIndicator(isScrollable);
      }
    };

    const handleScroll = () => {
      setShowScrollIndicator(false);
    };

    // Check initially and after content loads
    checkInitialScroll();
    setTimeout(checkInitialScroll, 100); // Check again after content might have loaded

    // Add scroll listener
    sidebar?.addEventListener("scroll", handleScroll, { once: true });

    // Cleanup
    return () => {
      sidebar?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Track when all validations become valid
  useEffect(() => {
    if (allValidationsValid) {
      track("all_validations_complete", {
        experienceId: experienceID,
        index: index,
        attempts: validationInstance.length, // Number of validation attempts
      });
    }
  }, [allValidationsValid, experienceID, index, validationInstance.length]);

  // Track when video ends
  useEffect(() => {
    if (isVideoEnded && !isVideoPlaying) {
      track("video_completed", {
        experienceId: experienceID,
        index: index,
        skipped: false,
      });
    }
  }, [isVideoEnded, isVideoPlaying, experienceID, index]);

  // Comment out skip video handler
  const handleSkipVideo = () => {
    // const videoElement = document.querySelector("video");
    // if (videoElement) {
    //   track("video_completed", {
    //     experienceId: experienceID,
    //     index: index,
    //     timeWatched: videoElement.currentTime,
    //     totalDuration: videoElement.duration,
    //     percentageWatched:
    //       (videoElement.currentTime / videoElement.duration) * 100,
    //   });
    //   // Check if the video is actually loaded and has a duration
    //   if (videoElement.readyState >= 2 && videoElement.duration) {
    //     // Set time to slightly before the end (e.g., 0.1 seconds before)
    //     videoElement.currentTime = Math.max(0, videoElement.duration - 0.1);
    //     // Use a promise to handle the seek operation
    //     const playPromise = videoElement.play();
    //     if (playPromise !== undefined) {
    //       playPromise
    //         .then(() => {
    //           // Playback started successfully
    //         })
    //         .catch((error) => {
    //           console.log("Error playing video:", error);
    //         });
    //     }
    //   } else {
    //     // If video isn't loaded, wait for it
    //     videoElement.addEventListener(
    //       "loadedmetadata",
    //       () => {
    //         videoElement.currentTime = Math.max(0, videoElement.duration - 0.1);
    //         videoElement.play();
    //       },
    //       { once: true }
    //     );
    //   }
    // }
  };

  return (
    <div className="relative flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Main Three.js Experience */}
      <div className="flex-grow bg-black h-1/2 md:h-full md:flex-1 relative">
        <VideoPlayer experienceId={experienceID} index={index} />
        <Experience />
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="w-full md:w-1/3 md:min-w-[300px] md:max-w-md bg-white p-6 overflow-y-auto h-1/2 md:h-full relative"
        style={{ height: "100lvh" }}
      >
        <div className="space-y-8">
          <OrderHandlerDB />

          {/* Remove Skip Video Button
          <AnimatePresence>
            {!isVideoEnded && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={handleSkipVideo}
                className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 
                  border border-blue-200 rounded-xl shadow-sm transition-all duration-300 
                  flex flex-col items-center gap-2"
              >
                <div className="flex flex-col items-center text-center space-y-1">
                  <span className="text-blue-700 text-lg font-medium">
                    Skip to the end of the video
                  </span>
                  <span className="text-blue-600/80 text-sm">
                    to apply your learning
                  </span>
                </div>
                <FastForward className="w-6 h-6 text-blue-500" />
              </motion.button>
            )}
          </AnimatePresence>
          */}

          {/* Validation Section */}
          <div className="space-y-6">
            <MobileValidation
              validations={validationInstance}
              showResults={showValidationResults}
            />

            {/* Verify button */}
            {isVideoEnded &&
              !isVideoPlaying &&
              validationInstance.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={handleValidationUpdate}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-xl shadow-md 
                  transition-all duration-300 hover:bg-green-700 hover:shadow-lg 
                  active:bg-green-800"
                >
                  <span className="text-lg font-semibold">Verify Answers</span>
                </motion.button>
              )}

            {/* Success Message */}
            {allValidationsValid && (
              <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 rounded-full p-1">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-green-800 font-semibold">Great work!</h3>
                </div>
                <p className="text-green-600 text-sm ml-9">
                  {hasNextExperience
                    ? "Move on to the next video"
                    : "You've completed this module!"}
                </p>
              </div>
            )}
          </div>

          {/* Navigation Container */}
          <div className="flex justify-between gap-4">
            {/* Previous Button */}
            {index > 0 && (
              <Link
                href={`/experience/data/${experienceID}/${index - 1}`}
                className="flex-1 group relative overflow-hidden rounded-xl bg-blue-600 px-4 py-3 text-white shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg active:bg-blue-800"
              >
                <span className="relative z-10 flex items-center justify-center text-lg font-semibold">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </span>
              </Link>
            )}

            {/* Next/Done Button */}
            <Link
              href={
                hasNextExperience
                  ? `/experience/data/${experienceID}/${index + 1}`
                  : `/`
              }
              prefetch={hasNextExperience}
              className={`flex-1 group relative overflow-hidden rounded-xl ${
                allValidationsValid
                  ? "bg-green-600 hover:bg-green-700 active:bg-green-800"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              } px-4 py-3 text-white shadow-md transition-all duration-300 hover:shadow-lg`}
            >
              <span className="relative z-10 flex items-center justify-center text-lg font-semibold">
                {hasNextExperience ? (
                  <>
                    Next Challenge
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                ) : (
                  "Home Page"
                )}
              </span>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        {showScrollIndicator && isVideoEnded && (
          <div
            className="absolute bottom-6 right-1/2 translate-x-1/2 z-50 cursor-pointer"
            onClick={() => {
              sidebarRef.current?.scrollTo({
                top: sidebarRef.current.scrollHeight,
                behavior: "smooth",
              });
            }}
          >
            <div className="flex items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-full w-12 h-12 shadow-sm hover:bg-black/30 transition-all duration-300">
              <ChevronDown className="w-7 h-7 text-white/80 animate-bounce" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
