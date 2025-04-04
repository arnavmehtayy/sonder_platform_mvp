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
import { DesktopEditExperience } from "@/app/Components/EditMode/DesktopEditExp";
import { MobileEditExperience } from "@/app/Components/EditMode/MobileEditExp";
import { useMediaQuery } from "@/app/Components/MainMenu/useMediaQuery";

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
  const isMobile = useMediaQuery("(max-width: 768px)");

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

  const handleNextSlide = async () => {
    await handleSave(); // save the state before going to the next slide
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
    }); // reset the state before going back to the main menu
    router.push(`/experience/edit/${expId}/${currentIndex + 1}`);
  };

  const handleEndExperience = async () => {
    await handleSave();
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
    }); // reset the state before going back to the main menu
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
      <div className="relative flex flex-row h-screen bg-gray-100">
        <div className="flex-grow bg-black h-full relative min-w-0">
          <div className="absolute top-4 left-4 z-[60]">
            <CurvedBackButton />
          </div>

          {isMobile ? (
            <MobileEditExperience expId={expId} currentIndex={currentIndex} />
          ) : (
            <div className="relative h-full" style={{ zIndex: 1 }}>
              <DesktopEditExperience
                expId={expId}
                currentIndex={currentIndex}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
