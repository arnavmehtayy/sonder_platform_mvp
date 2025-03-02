"use client";
import { useState, useEffect } from "react";
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
  Save,
  RefreshCw,
  Menu,
  Plus,
  ChevronDown,
  Camera,
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

  useEffect(() => {
    setIsEditMode(true);
    return () => setIsEditMode(false);
  }, [setIsEditMode]);

  const loadVideo = async () => {
    try {
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
      }
    } catch (error) {
      console.error("Error loading video:", error);
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
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Failed to replace video");
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

  const handleResetState = () => {
    useStore.setState({
      order: [],
      vizobjs: {},
      title: "",
      questions: {},
      controls: {},
      placement: {},
      scores: {},
      validations: [],
      influenceAdvIndex: {},
    });
    toast.success("State has been reset");
  };

  const handleValidationUpdate = () => {
    updateValidation();
    setShowValidationResults(true);
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
              showControls ? "h-1/2" : "h-full"
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
                          />
                          <label
                            htmlFor="video-upload"
                            className="block w-full px-4 py-3 text-white hover:bg-white/10 cursor-pointer"
                          >
                            Upload from device
                          </label>
                          <button
                            onClick={() => {
                              document
                                .getElementById("video-options")
                                ?.classList.add("hidden");
                              setShowCameraRecorder(true);
                            }}
                            className="block w-full px-4 py-3 text-white hover:bg-white/10 text-left"
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
                {/* Loading indicator when fetching video */}
                {videoUrl === null && (
                  <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                    <p className="text-white/80 text-sm font-medium">
                      Loading video...
                    </p>
                  </div>
                )}

                {/* Upload options - only show after we've determined there's no video */}
                {videoUrl === null && (
                  <div className="flex flex-col gap-4 mt-4">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload-initial"
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
                    >
                      <Camera className="h-12 w-12 mx-auto mb-4 text-red-500" />
                      <span className="font-medium">Record Video</span>
                    </button>
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
                className="absolute bottom-0 left-0 right-0 h-1/2 bg-white rounded-t-3xl overflow-hidden shadow-2xl"
              >
                <div className="h-full overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+4rem)]">
                  {/* Pull indicator */}
                  <div className="sticky top-0 w-full bg-white pt-2 pb-4 flex justify-center z-10">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                  </div>

                  {/* Content */}
                  <div className="px-4 space-y-6">
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSave}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={handleResetState}
                        variant="destructive"
                        className="flex-1"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>

                    {/* Order Handler */}
                    <OrderHandlerDB isEditMode />

                    {/* Validation Section */}
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
                          Test Validations
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
