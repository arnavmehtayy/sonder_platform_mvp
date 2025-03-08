"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  useStore,
  getIsVideoEndedSelector,
  getIsVideoPlayingSelector,
  UpdateValidationSelector,
  setIsEditModeSelector,
} from "@/app/store";
import { MobileVideoPlayer } from "../MainMenu/Mobile/VideoPlayerMobile";
import { OrderHandlerDB } from "../Sidebar/OrderHandlerDB";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUp,
  Menu,
  Plus,
  ChevronDown,
  Camera,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { createClient } from "@/app/utils/supabase/client";
import { toast } from "sonner";
import { serializeState } from "@/classes/database/stateSerializer";
import { Button } from "@/components/ui/button";
import Experience from "../visualexp";
import { MobileValidation } from "../MainMenu/Mobile/MobileValidation";
import { CameraRecorder } from "../MainMenu/Mobile/CameraRecorder";

interface MobileEditExperienceProps {
  expId: number;
  currentIndex: number;
}

export function MobileEditExperience({
  expId,
  currentIndex,
}: MobileEditExperienceProps) {
  const router = useRouter();
  const [showControls, setShowControls] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoKey, setVideoKey] = useState(0);
  const [showCameraRecorder, setShowCameraRecorder] = useState(false);
  const updateValidation = useStore(UpdateValidationSelector);
  const validationInstance = useStore((state) => state.validations);
  const [showValidationResults, setShowValidationResults] = useState(false);
  const setIsEditMode = useStore(setIsEditModeSelector);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [allValidationsValid, setAllValidationsValid] = useState(false);
  const questionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsEditMode(true);
    return () => setIsEditMode(false);
  }, [setIsEditMode]);

  const loadVideo = async () => {
    try {
      setIsLoadingVideo(true);

      const response = await fetch(
        `/api/supabase/video?experienceId=${expId}&index=${currentIndex}`
      );
      if (!response.ok) throw new Error("Failed to fetch video");
      const data = await response.json();
      if (data?.video_path) {
        const supabase = createClient();
        const {
          data: { publicUrl },
        } = supabase.storage
          .from(data.bucket_name)
          .getPublicUrl(data.video_path);
        setVideoUrl(publicUrl);
        setVideoKey((prev) => prev + 1);
      } else {
        setVideoUrl(null);
      }
    } catch (error) {
      console.error("Error loading video:", error);
      setVideoUrl(null);
    } finally {
      setIsLoadingVideo(false);
    }
  };

  useEffect(() => {
    loadVideo();
  }, [expId, currentIndex]);

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("handleVideoUpload CLICKED");
    const file = event.target.files?.[0];
    if (!file) return;

    // Set uploading state to true to show feedback
    setIsUploading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Get bucket name
      const bucketResponse = await fetch(
        `/api/supabase/bucket?experienceId=${expId}&userId=${user?.id}`
      );
      const { bucket_name } = await bucketResponse.json();
      const bucketName = bucket_name || "experience-videos";

      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop();
      const fileName = `video_${timestamp}.${fileExtension}`;
      const filePath = `${expId}/${currentIndex}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const response = await fetch("/api/supabase/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          experienceId: expId.toString(),
          index: currentIndex,
          filePath: filePath,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update database: ${errorData.error}`);
      }

      await loadVideo();
      toast.success("Video replaced successfully");

      // Automatically save state after successful video upload
      await handleSave();

      // Automatically show the edit questions panel
      setShowControls(true);
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Failed to replace video");
    } finally {
      // Reset uploading state regardless of success or failure
      setIsUploading(false);
    }
  };

  const handleCameraRecording = async (recordedBlob: Blob) => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Get bucket name
      const bucketResponse = await fetch(
        `/api/supabase/bucket?experienceId=${expId}&userId=${user?.id}`
      );
      const { bucket_name } = await bucketResponse.json();
      const bucketName = bucket_name || "experience-videos";

      const timestamp = Date.now();
      const fileName = `video_${timestamp}.webm`;
      const filePath = `${expId}/${currentIndex}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, recordedBlob);

      if (uploadError) throw uploadError;

      const response = await fetch("/api/supabase/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          experienceId: expId.toString(),
          index: currentIndex,
          filePath: filePath,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update database: ${errorData.error}`);
      }

      await loadVideo();
      setShowCameraRecorder(false);
      toast.success("Video recorded and saved successfully");

      // Automatically save state after successful video recording
      await handleSave();

      // Automatically show the edit questions panel
      setShowControls(true);
    } catch (error) {
      console.error("Error saving recorded video:", error);
      toast.error("Failed to save recorded video");
    }
  };

  const handleSave = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("Please log in to save your state");
        return;
      }

      // Fetch profile using the user ID
      const profileResponse = await fetch(
        `/api/supabase/profile?userId=${user.id}`
      );
      if (!profileResponse.ok) {
        toast.error("Unable to find user profile");
        return;
      }
      const profile = await profileResponse.json();

      const state = useStore.getState();
      const serializedState = serializeState(state);
      const response = await fetch("/api/supabase/DataBaseAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: serializedState,
          profileId: profile.id,
          experienceId: expId,
          index: currentIndex,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save state");
      }

      toast.success("State saved successfully");
    } catch (error) {
      console.error("Error saving state:", error);
      toast.error("Failed to save state");
    }
  };

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !e.target ||
        (!(e.target as Element).closest("#video-options") &&
          !(e.target as Element).closest("button[data-video-options]"))
      ) {
        document.getElementById("video-options")?.classList.add("hidden");
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative h-[100dvh] w-full bg-black">
      {showCameraRecorder ? (
        <CameraRecorder
          onSave={handleCameraRecording}
          onCancel={() => setShowCameraRecorder(false)}
        />
      ) : (
        <>
          {/* Video and Experience Section */}
          <div
            className={`w-full ${
              showControls ? "h-[30%]" : "h-full"
            } transition-all duration-500 relative`}
          >
            {videoUrl ? (
              <div className="relative w-full h-full">
                <MobileVideoPlayer
                  experienceId={expId}
                  index={currentIndex}
                  key={videoKey}
                  editMode={true}
                />

                {/* Custom video controls positioned below the progress bar */}
                <div className="absolute bottom-6 left-0 right-0 z-40 px-6">
                  <div className="flex items-center justify-between">
                    {/* Replace Video Button - Left side */}
                    <div>
                      <div className="relative group">
                        <button
                          data-video-options="true"
                          className="rounded-full bg-white/20 p-3 backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            document
                              .getElementById("video-options")
                              ?.classList.toggle("hidden");
                          }}
                        >
                          <RefreshCw className="h-8 w-8 text-white" />
                        </button>
                        <span className="text-white text-xs mt-1.5 font-medium block text-center">
                          Replace Video
                        </span>

                        {/* Dropdown menu for video options */}
                        <div
                          id="video-options"
                          className="hidden absolute bottom-full mb-2 left-0 bg-black/80 backdrop-blur-md rounded-lg overflow-hidden w-40 shadow-lg"
                        >
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              handleVideoUpload(e);
                              document
                                .getElementById("video-options")
                                ?.classList.add("hidden");
                            }}
                            className="hidden"
                            id="video-upload"
                            disabled={isUploading}
                          />
                          <label
                            htmlFor="video-upload"
                            className={`block w-full px-4 py-3 text-white hover:bg-white/10 cursor-pointer ${
                              isUploading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            {isUploading
                              ? "Uploading..."
                              : "Upload from device"}
                          </label>
                          <button
                            onClick={() => {
                              document
                                .getElementById("video-options")
                                ?.classList.add("hidden");
                              setShowCameraRecorder(true);
                            }}
                            className="block w-full px-4 py-3 text-white hover:bg-white/10 text-left"
                            disabled={isUploading}
                          >
                            Record with camera
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Center space for the existing pause button */}
                    <div className="flex-1"></div>

                    {/* Edit Questions Button - Right side */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => setShowControls(!showControls)}
                        className="rounded-full bg-white/20 p-3 backdrop-blur-sm"
                      >
                        {showControls ? (
                          <ChevronDown className="h-8 w-8 text-white" />
                        ) : (
                          <ChevronUp className="h-8 w-8 text-white" />
                        )}
                      </button>
                      <span className="text-white text-xs mt-1.5 font-medium">
                        {showControls ? "Hide Questions" : "Edit Questions"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
                {/* Loading indicator - only show when actually loading */}
                {isLoadingVideo && (
                  <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                    <p className="text-white/80 text-sm font-medium">
                      Loading video...
                    </p>
                  </div>
                )}

                {/* Upload options - only show when finished loading and no video found */}
                {!isLoadingVideo && videoUrl === null && !isUploading && (
                  <div className="flex flex-col gap-4 mt-4">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload-initial"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="video-upload-initial"
                      className="cursor-pointer"
                    >
                      <div className="p-8 rounded-xl bg-white/90 text-center">
                        <Plus className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                        <span className="font-medium">Upload Video</span>
                      </div>
                    </label>

                    <button
                      onClick={() => setShowCameraRecorder(true)}
                      className="p-8 rounded-xl bg-white/90 text-center"
                      disabled={isUploading}
                    >
                      <Camera className="h-12 w-12 mx-auto mb-4 text-red-500" />
                      <span className="font-medium">Record Video</span>
                    </button>
                  </div>
                )}

                {/* Upload progress indicator */}
                {isUploading && (
                  <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                    <p className="text-white/80 text-sm font-medium">
                      Uploading video...
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Experience Layer */}
            {/* <div className="absolute inset-0 pointer-events-none">
              <Experience />
            </div> */}
          </div>

          {/* Controls Panel */}
          <AnimatePresence>
            {showControls && (
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
                  <div className="px-4 space-y-6 mb-16">
                    {/* Order Handler */}
                    <OrderHandlerDB isEditMode />

                    {/* Validation Section */}
                    <div id="validation-results" className="pt-4">
                      <MobileValidation
                        validations={validationInstance}
                        showResults={showValidationResults}
                      />
                    </div>

                    {/* Success Message */}
                    {allValidationsValid && showValidationResults && (
                      <div className="p-4 bg-green-50 border border-green-100 rounded-xl mb-2">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-green-100 rounded-full p-1">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <h3 className="text-green-800 font-semibold">
                            Great work!
                          </h3>
                        </div>
                        <p className="text-green-600 text-sm ml-9">
                          All validations are passing!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Floating Scroll Indicator */}
                <AnimatePresence>
                  {showScrollIndicator && showValidationResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-1/2 bottom-28 transform -translate-x-1/2 z-20"
                      onClick={scrollToValidationResults}
                    >
                      <div
                        className="bg-black bg-opacity-40 rounded-full p-3 cursor-pointer
                                  hover:bg-opacity-60 transition-all duration-300 shadow-lg"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
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
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-md">
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
                                  validationInstance.filter((v) =>
                                    v.get_isValid()
                                  ).length
                                }{" "}
                                of {validationInstance.length} Correct - Try
                                Again!
                              </span>
                            </>
                          )}
                        </>
                      ) : (
                        <span>Test Validations</span>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
