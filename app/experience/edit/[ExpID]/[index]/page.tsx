"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useStore,
  getStateName,
  getPlacementListSelector,
  setIsEditModeSelector,
  State,
  UpdateValidationSelector,
  getSideBarName,
  getValidationDescription,
  deleteValidationByIndexSelect,
  getAdvancedInfluencesSelector,
  getInfluenceAdvDelete,
  getIsVideoPlayingSelector,
  getIsVideoEndedSelector,
} from "@/app/store";
import Experience from "@/app/Components/visualexp";
import { EditBar, ObjectType } from "@/app/Components/EditMode/EditBar";
import { OrderHandler } from "@/app/Components/Sidebar/OrderHandler";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  deserializeState,
  serializeState,
} from "@/classes/database/stateSerializer";
import { createClient } from "@/app/utils/supabase/client";
import { OrderHandlerDB } from "@/app/Components/Sidebar/OrderHandlerDB";
import ValidationComponent from "@/app/Components/ShowValid";
import { ArrowRightLeft, CheckCircle } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Save, X, RefreshCw } from "lucide-react";
import { FeedbackComponent } from "@/app/Components/MainMenu/FeedbackComponent";
import CurvedBackButton from "@/app/Components/three/BackButton";
import { SceneManager } from "@/app/Components/Sidebar/SceneManager";
import { LoadingScreen } from "@/app/Components/MainMenu/LoadingScreen";
import { DummyDataManager } from "@/app/Components/DummyData/DummyDataManager";
import { ObjectTreeManager } from "@/app/Components/SceneManager/ObjectTreeManager";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  Plus,
  List,
  MousePointerClick,
  Calculator,
  PencilLine,
  Circle,
  LineChart,
  Axis3D,
  Type,
  Variable,
  Sliders,
  ListChecks,
  Table,
  Hash,
} from "lucide-react";
import { SliderControlAdvanced } from "@/classes/Controls/SliderControlAdv";
import { SelectControl } from "@/classes/Controls/SelectControl";
import Placement from "@/classes/Placement";
import { FunctionScore } from "@/classes/Scores/FunctionScore";
import { InfluenceAdvanced } from "@/classes/influenceAdv";
import { Question } from "@/classes/Question";
import { MultiChoiceClass } from "@/classes/Controls/MultiChoiceClass";
import { TableControl } from "@/classes/Controls/TableControl";
import { InputNumber } from "@/classes/Controls/InputNumber";
import { DropDownMenu } from "@/app/Components/EditMode/DropDownMenu";
import { AnimatePresence } from "framer-motion";
import { VideoPlayer } from "@/app/Components/MainMenu/VideoPlayer";
import { motion } from "framer-motion";
import { FastForward } from "lucide-react";

const SortableItem: React.FC<{ id: string; children: React.ReactNode }> = ({
  id,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center bg-gray-100 p-2 rounded"
    >
      <div {...attributes} {...listeners} className="cursor-move mr-2">
        <GripVertical size={20} />
      </div>
      {children}
    </li>
  );
};

export default function ExperienceEditPage() {
  const router = useRouter();
  const params = useParams();
  const expId = parseInt(params.ExpID as string);
  const currentIndex = parseInt(params.index as string);
  const [isLoading, setIsLoading] = useState(true);

  const reset = useStore((state) => state.reset);
  const setIsEditMode = useStore(setIsEditModeSelector);

  const [showValidation, setShowValidation] = useState(false);
  const [allValidationsValid, setAllValidationsValid] = useState(false);
  const validationInstance = useStore((state) => state.validations);
  const updateValidation = useStore(UpdateValidationSelector);

  const order = useStore((state) => state.order);
  const setOrder = useStore((state) => state.setOrder);
  const deleteOrderItem = useStore((state) => state.deleteOrderItem);
  const deleteVizObj = useStore((state) => state.deleteVizObj);
  const deleteQuestion = useStore((state) => state.deleteQuestion);
  const deletePlacement = useStore((state) => state.deletePlacement);
  const deleteScore = useStore((state) => state.deleteScore);

  const vizobjs = useStore((state) => state.vizobjs);
  const getName = useStore(getSideBarName);
  const validationDescriptions = useStore(getValidationDescription);
  const validationDeletor = useStore(deleteValidationByIndexSelect);

  const advancedInfluences = useStore(getAdvancedInfluencesSelector);
  const deleteInfluenceAdv = useStore(getInfluenceAdvDelete);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [isPreviousDisabled, setIsPreviousDisabled] = useState(true);

  useEffect(() => {
    setIsPreviousDisabled(currentIndex === 0);
  }, [currentIndex]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = order.findIndex(
        (item) => `${item.type}-${item.id}` === active.id
      );
      const newIndex = order.findIndex(
        (item) => `${item.type}-${item.id}` === over.id
      );
      const newOrder = [...order];
      const [reorderedItem] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, reorderedItem);
      setOrder(newOrder);
    }
  };

  const handleDeleteItem = (id: number, type: string) => {
    deleteOrderItem(id, type);
    if (type === "control") {
      deleteVizObj(id);
    }
    if (type === "question") {
      deleteQuestion(id);
    }
    if (type === "placement") {
      deletePlacement(id);
    }
    if (type === "score") {
      deleteScore(id);
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

  useEffect(() => {
    const initializeState = async () => {
      setIsLoading(true);
      try {
        // Auth check
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          router.push("/login");
          return;
        }

        // Check experience permissions
        const response = await fetch(
          `/api/supabase/experiences/${expId}/permissions`
        );
        const { hasAccess, isEditor } = await response.json();

        if (!hasAccess) {
          toast.error("You don't have permission to access this experience");
          router.push("/");
          return;
        }

        if (!isEditor) {
          toast.error("Only editors can access the experience editor");
          router.push("/");
          return;
        }

        // Load state if authorized
        const checkResponse = await fetch(
          `/api/supabase/check-next?experienceId=${expId}&index=${currentIndex}`
        );
        const checkData = await checkResponse.json();

        if (checkData.hasNext) {
          const response = await fetch(
            `/api/supabase/DataBaseAPI?experienceId=${expId}&index=${currentIndex}`
          );

          if (response.ok) {
            const serializedState = await response.json();
            const loadedState = deserializeState(serializedState);
            if (loadedState) {
              useStore.setState(loadedState);
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to load experience");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    initializeState();
  }, [expId, currentIndex, reset, router]);

  useEffect(() => {
    const checkAllValidations = () => {
      const allValid = validationInstance.every((validation) =>
        validation.get_isValid()
      );
      setAllValidationsValid(allValid);
    };
    checkAllValidations();
  }, [validationInstance]);

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

  const handleNextSlide = () => {
    // handleSave();
    router.push(`/experience/edit/${expId}/${currentIndex + 1}`);
  };

  const handleEndExperience = () => {
    handleSave();
    router.push("/");
  };

  const handleValidationUpdate = () => {
    updateValidation();
    setShowValidation(true);
    setShowValidationResults(true);
  };

  const handlePreviousSlide = () => {
    if (currentIndex > 0) {
      //   handleSave();
      router.push(`/experience/edit/${expId}/${currentIndex - 1}`);
    }
  };

  useEffect(() => {
    setIsEditMode(true);
    return () => setIsEditMode(false); // Clean up when leaving the page
  }, [setIsEditMode]);

  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoKey, setVideoKey] = useState(0);
  const isVideoPlaying = useStore(getIsVideoPlayingSelector);
  const isVideoEnded = useStore(getIsVideoEndedSelector);

  const loadVideo = async () => {
    try {
      const response = await fetch(
        `/api/supabase/video?experienceId=${expId}&index=${currentIndex}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch video");
      }

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

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("Uploading video");
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Get bucket name from new route with userId
      const bucketResponse = await fetch(
        `/api/supabase/bucket?experienceId=${expId}&userId=${user?.id}`
      );
      const { bucket_name } = await bucketResponse.json();
      const bucketName = bucket_name || "experience-videos";

      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop();
      const fileName = `video_${timestamp}.${fileExtension}`;
      const filePath = `${expId}/${currentIndex}/${fileName}`;

      console.log("Using bucket:", bucketName);
      console.log("Attempting to upload to path:", filePath);

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      console.log("Sending to API:", {
        experienceId: expId.toString(),
        index: parseInt(currentIndex.toString()),
        filePath: filePath,
      });

      const response = await fetch("/api/supabase/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          experienceId: expId.toString(),
          index: parseInt(currentIndex.toString()),
          filePath: filePath,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(`Failed to update database: ${errorData.error}`);
      }

      await loadVideo();
      toast.success("Video replaced successfully");
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Failed to replace video");
    }
  };

  useEffect(() => {
    loadVideo();
  }, [expId, currentIndex]);

  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const bar = e.currentTarget;
      const rect = bar.getBoundingClientRect();
      const percentage = (e.clientX - rect.left) / rect.width;
      const newTime = videoRef.current.duration * percentage;
      videoRef.current.currentTime = newTime;
      setProgress(percentage * 100);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowPlayButton(true);
      } else {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setShowPlayButton(false);
          })
          .catch((error) => {
            console.log("Play failed:", error);
            setIsPlaying(false);
            setShowPlayButton(true);
          });
      }
    }
  };

  const handleSkipVideo = () => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      videoElement.currentTime = videoElement.duration;
      videoElement.play();
    }
  };

  const [showValidationResults, setShowValidationResults] = useState(false);

  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading Experience Editor"
        description="Please wait while we prepare your experience editor..."
      />
    );
  }

  return (
    <>
      <EditBar />

      <div className="relative flex flex-row h-screen bg-gray-100">
        {/* Comment out Left Sidebar
        <div
          className={`transition-all duration-300 ease-in-out ${
            isLeftSidebarCollapsed ? "w-0" : "w-64"
          } flex-shrink-0 relative`}
        >
          <div className="relative h-full">
            <ObjectTreeManager />
            <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-50">
              <Button
                onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
                className={`h-12 w-12 rounded-full bg-white hover:bg-gray-50 border border-gray-200 shadow-lg flex items-center justify-center transition-all duration-300 ${
                  isLeftSidebarCollapsed ? "translate-x-3" : ""
                }`}
              >
                {isLeftSidebarCollapsed ? (
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                )}
              </Button>
            </div>
          </div>
        </div>
        */}

        {/* Main Experience Area */}
        <div className="flex-grow bg-black h-full relative min-w-0">
          <div className="absolute top-4 left-4 z-50">
            <CurvedBackButton />
          </div>

          {/* Video Upload Button */}
          <div className="absolute top-4 right-4 z-50">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
              id="video-upload"
            />
            <label htmlFor="video-upload">
              <Button
                variant="outline"
                className="cursor-pointer bg-black/50 hover:bg-black/70 text-white border-none"
                asChild
              >
                <div className="flex items-center gap-2">
                  <RefreshCw size={16} />
                  Replace Video
                </div>
              </Button>
            </label>
          </div>

          {/* Video Player */}
          <VideoPlayer
            experienceId={expId}
            index={currentIndex}
            key={videoKey}
            isEditMode={true}
          />

          {/* Experience always visible in edit mode */}
          <div
            className={`absolute inset-0 ${"pointer-events-none"}`}
            style={{ zIndex: 10 }}
          >
            <Experience />
          </div>

          {/* Validation Panel with fixed positioning */}
          <div
            className={`fixed bottom-32 left-1/3 transform -translate-x-1/2 w-[calc(100%-2rem)] md:w-96 bg-white rounded-lg shadow-xl transition-all duration-300 ${
              showValidation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full pointer-events-none"
            } z-[60]`}
          >
            <div className="p-4 max-h-[30vh] overflow-y-auto">
              <ValidationComponent
                validations={validationInstance}
                updater={handleValidationUpdate}
                isChecked={showValidationResults}
              />
            </div>
          </div>

          {/* Toggle button with fixed positioning */}
          <button
            onClick={() => setShowValidation(!showValidation)}
            className={`fixed bottom-20 left-1/3 transform -translate-x-1/2 flex items-center space-x-2 px-4 py-2 rounded-md shadow-lg transition-all duration-300 z-[60] ${
              allValidationsValid
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {allValidationsValid && (
              <CheckCircle className="text-white" size={20} />
            )}
            <span className="text-white font-semibold">
              {showValidation ? "Hide Autograder" : "Show Autograder"}
            </span>
          </button>
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-1/3 md:min-w-[300px] md:max-w-md bg-blue-50 h-full flex-shrink-0">
          <div className="h-full overflow-y-auto overflow-x-visible p-4 pb-24">
            {/* Scene Manager Button */}
            <div className="mb-6 relative z-10">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-md">
                    <GripVertical size={18} />
                    <span className="font-medium">Scene Manager</span>
                  </Button>
                </DialogTrigger>
                <SceneManager
                  sensors={sensors}
                  handleDragEnd={handleDragEnd}
                  handleDeleteItem={handleDeleteItem}
                />
              </Dialog>
            </div>

            {/* OrderHandlerDB - Always visible in edit mode */}
            <div className="relative mb-8">
              <OrderHandlerDB isEditMode={true} />
            </div>
            {/* Verify Button */}
            {validationInstance.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={handleValidationUpdate}
                className="w-full px-4 py-3 mb-6 bg-green-600 text-white rounded-xl shadow-md 
                  transition-all duration-300 hover:bg-green-700 hover:shadow-lg 
                  active:bg-green-800"
              >
                <span className="text-lg font-semibold">Verify Answers</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center z-20 shadow-lg">
        <div className="flex items-center gap-4">
          {!isPreviousDisabled && (
            <Button
              onClick={handlePreviousSlide}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <ChevronLeft size={16} />
              Previous Step
            </Button>
          )}
          <Button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700"
          >
            <Save size={16} />
            Save Progress
          </Button>
          <Button
            onClick={handleResetState}
            className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700"
          >
            <RefreshCw size={16} />
            Reset State
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleEndExperience}
            variant="outline"
            className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            <X size={16} />
            Exit Editor
          </Button>
          <Button
            onClick={handleNextSlide}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white min-w-[140px]"
          >
            Next Step
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </>
  );
}
