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
} from "@/app/store";
import { experiences } from "@/classes/Data/CompleteData";
import "katex/dist/katex.min.css";
import "../style.css";
import ValidationComponent from "../ShowValid";
import { OrderHandler } from "./OrderHandler";
import { CheckCircle, ChevronDown } from 'lucide-react';
import { OrderHandlerDB } from "./OrderHandlerDB";
import { VideoPlayer } from "../MainMenu/VideoPlayer";

export function MinigameDB({experienceID, index}: {experienceID: number, index: number}) {
  const state_name = useStore(getStateName);
  const updateValidation = useStore(UpdateValidationSelector);
  const validationInstance = useStore((state) => state.validations);
  const [showValidation, setShowValidation] = useState(true);
  const [allValidationsValid, setAllValidationsValid] = useState(false);
  const [hasNextExperience, setHasNextExperience] = useState(false);
  const [showValidationResults, setShowValidationResults] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  const handleValidationUpdate = () => {
    updateValidation();
    setShowValidationResults(true);
    setShowValidation(true);
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
        const response = await fetch(`/api/supabase/check-next?experienceId=${experienceID}&index=${index+1}`);
        const data = await response.json();
        setHasNextExperience(data.hasNext);
      } catch (error) {
        console.error('Error checking next experience:', error);
        setHasNextExperience(false);
      }
    };

    checkNextExperience();
  }, [experienceID, index]);

  useEffect(() => {
    if (hasNextExperience) {
      const preloadVideo = async () => {
        try {
          await fetch(`/api/supabase/video?experienceId=${experienceID}&index=${index + 1}`, {
            priority: 'low'
          });
        } catch (error) {
          console.error('Error preloading next video:', error);
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
    sidebar?.addEventListener('scroll', handleScroll, { once: true });

    // Cleanup
    return () => {
      sidebar?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Main Three.js Experience */}
      <div className="flex-grow bg-black h-1/2 md:h-full md:flex-1 relative">
        <VideoPlayer experienceId={experienceID} index={index} />
        {/* <Experience /> */}

        {/* Validation Panel - Positioned above navigation */}
        <div
          className={`absolute bottom-16 left-4 w-[calc(100%-2rem)] md:w-96 bg-white rounded-lg shadow-xl transition-all duration-300 ${
            showValidation
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-full pointer-events-none"
          } z-30`}
        >
          <div className="p-4 max-h-[30vh] md:max-h-[calc(100vh-400px)] overflow-y-auto">
            <ValidationComponent
              validations={validationInstance}
              updater={handleValidationUpdate}
              isChecked={showValidationResults}
            />
          </div>
        </div>

        {/* Toggle button - Positioned above navigation */}
        <button
          onClick={() => setShowValidation(!showValidation)}
          className={`absolute bottom-4 left-4 flex items-center space-x-2 px-4 py-2 rounded-md shadow-lg transition-all duration-300 z-40 ${
            allValidationsValid 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {allValidationsValid && <CheckCircle className="text-white" size={20} />}
          <span className="text-white font-semibold">
            {showValidation ? 'Hide Autograder' : 'Show Autograder'}
          </span>
        </button>
      </div>

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className="w-full md:w-1/3 md:min-w-[300px] md:max-w-md bg-white p-4 overflow-y-auto h-1/2 md:h-full relative"
        style={{ height: "100lvh" }}
      >
        <OrderHandlerDB />
        
        {/* Navigation buttons and verify button */}
        {/* Verify button */}
        <button onClick={handleValidationUpdate} className="w-full mt-6 px-4 py-3 bg-green-600 text-white rounded-lg shadow-md transition-all duration-300 hover:bg-green-700 hover:shadow-lg active:bg-green-800">
          <span className="text-lg font-semibold">Verify</span>
        </button>

        <div className="flex justify-between mt-6 mb-4 gap-4">
          {index > 0 && (
            <Link
              href={`/experience/data/${experienceID}/${index - 1}`}
              className={`flex-1 group relative overflow-hidden rounded-lg bg-blue-600 px-4 py-3 text-white shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg active:bg-blue-800`}
            >
              <span className="relative z-10 flex items-center justify-center text-lg font-semibold">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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
          <Link
            href={hasNextExperience 
              ? `/experience/data/${experienceID}/${index + 1}`
              : `/experience/thank-you/${experienceID}`}
            prefetch={hasNextExperience}
            className={`flex-1 group relative overflow-hidden rounded-lg bg-blue-600 px-4 py-3 text-white shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg active:bg-blue-800`}
          >
            <span className="relative z-10 flex items-center justify-center text-lg font-semibold">
              {hasNextExperience ? (
                <>
                  Next
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
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
                "Done"
              )}
            </span>
          </Link>
        </div>

        {/* Floating Scroll Indicator - Overlay */}
        {showScrollIndicator && (
          <div 
            className="absolute bottom-6 right-1/2 translate-x-1/2 z-50 cursor-pointer"
            onClick={() => {
              sidebarRef.current?.scrollTo({
                top: sidebarRef.current.scrollHeight,
                behavior: 'smooth'
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