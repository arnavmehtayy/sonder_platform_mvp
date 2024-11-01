"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useStore,
  getStateName,
  getPlacementListSelector,
  State,
  UpdateValidationSelector,
  getSideBarName,
  getValidationDescription,
  deleteValidationByIndexSelect,
} from "@/app/store";
import Experience from "@/app/Components/visualexp";
import { EditBar } from "@/app/Components/EditMode/EditBar";
import { OrderHandler } from "@/app/Components/Sidebar/OrderHandler";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deserializeState, serializeState } from "@/classes/database/stateSerializer";
import { createClient } from "@/app/utils/supabase/client";
import { OrderHandlerDB } from "@/app/Components/Sidebar/OrderHandlerDB";
import ValidationComponent from "@/app/Components/ShowValid";
import { CheckCircle } from "lucide-react";
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
import { ChevronLeft, ChevronRight, Save, X } from "lucide-react";
import { FeedbackComponent } from "@/app/Components/MainMenu/FeedbackComponent";
import CurvedBackButton from "@/app/Components/three/BackButton";

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

  const reset = useStore((state) => state.reset);

  const [showValidation, setShowValidation] = useState(true);
  const [allValidationsValid, setAllValidationsValid] = useState(false);
  const validationInstance = useStore((state) => state.validations);
  const updateValidation = useStore(UpdateValidationSelector);

  const order = useStore((state) => state.order);
  const setOrder = useStore((state) => state.setOrder);
  const deleteOrderItem = useStore((state) => state.deleteOrderItem);
  const deleteVizObj = useStore((state) => state.deleteVizObj);
  const vizobjs = useStore((state) => state.vizobjs);
  const getName = useStore(getSideBarName);
  const validationDescriptions = useStore(getValidationDescription);
  const validationDeletor = useStore(deleteValidationByIndexSelect);

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
    if (type === "control" || type === "placement" || type === "question") {
      deleteVizObj(id);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = await createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
      }
    };

    checkAuth();

    const loadExistingState = async () => {
      try {
        // First check if the state exists
        const checkResponse = await fetch(
          `/api/supabase/check-next?experienceId=${expId}&index=${currentIndex}`
        );
        const checkData = await checkResponse.json();

        if (checkData.hasNext) {
          // If state exists, load it
          const response = await fetch(
            `/api/supabase/DataBaseAPI?experienceId=${expId}&index=${currentIndex}`
          );

          if (response.ok) {
            const serializedState = await response.json();
            const loadedState = deserializeState(serializedState);

            console.log(loadedState);
            if (loadedState) {
              useStore.setState(loadedState);
            }
          }
        } else {
          useStore.setState({
            order: [],
            vizobjs: {},
            title: "",
            questions: {},
            controls: {},
            placement: {},
            scores: {},
            validations: [],
          });
        }
      } catch (error) {
        console.error("Error loading state:", error);
      }
    };
    loadExistingState();
  }, [expId, currentIndex, reset]);

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
      const supabase = await createClient();
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
    handleSave();
    router.push(`/experience/edit/${expId}/${currentIndex + 1}`);
  };

  const handleEndExperience = () => {
    handleSave();
    router.push("/");
  };

  const handleValidationUpdate = () => {
    updateValidation();
  };

  const handlePreviousSlide = () => {
    if (currentIndex > 0) {
      handleSave();
      router.push(`/experience/edit/${expId}/${currentIndex - 1}`);
    }
  };

  return (
    <>
      <EditBar />
      <div className="fixed top-4 left-4 z-50">
        <CurvedBackButton />
      </div>
      {/* <div className="fixed bottom-20 right-4 z-50">
                <FeedbackComponent />
            </div> */}

      <div className="relative flex flex-col md:flex-row h-screen bg-gray-100">
        {/* Main Three.js Experience */}
        <div className="flex-grow bg-black h-1/2 md:h-full md:flex-1">
          <Experience />
        </div>

        {/* Autograder Button - Repositioned */}
        {/* <button
                    onClick={() => setShowValidation(!showValidation)}
                    className={`fixed bottom-24 left-4 flex items-center space-x-2 px-4 py-2 rounded-md shadow-lg transition-all duration-300 z-40 ${
                        allValidationsValid 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {allValidationsValid && <CheckCircle className="text-white" size={20} />}
                    <span className="text-white font-semibold">
                        {showValidation ? 'Hide Autograder' : 'Show Autograder'}
                    </span>
                </button> */}

        {/* Validation Panel - Repositioned */}
        <div
          className={`fixed bottom-24 left-4 w-96 bg-white rounded-lg shadow-xl transition-all duration-300 ${
            showValidation
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-full pointer-events-none"
          } z-30`}
        >
          <div className="p-4 max-h-[400px] overflow-y-auto">
            <ValidationComponent
              validations={validationInstance}
              updater={handleValidationUpdate}
            />
          </div>
        </div>

        {/* Navigation Controls - Updated styling */}
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

        {/* Sidebar */}
        <div className="w-full md:w-1/3 md:min-w-[300px] md:max-w-md bg-blue-50 p-4 pb-24 overflow-y-auto h-1/2 md:h-full relative">
          {/* Add Scene Manager Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="absolute top-3 right-3 flex items-center gap-2 px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-md z-10">
                <GripVertical size={18} />
                <span className="text-sm font-medium">Scene Manager</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Scene Manager</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={order.map((item) => `${item.type}-${item.id}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    <ul className="space-y-2">
                      {order.map((item) => (
                        <SortableItem
                          key={`${item.type}-${item.id}`}
                          id={`${item.type}-${item.id}`}
                        >
                          <div className="flex-grow">{getName(item)}</div>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.type)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </SortableItem>
                      ))}
                    </ul>
                  </SortableContext>
                </DndContext>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">
                  Visual Objects Manager
                </h3>
                <ul className="space-y-2">
                  {Object.entries(vizobjs).map(([id, obj]) => (
                    <li
                      key={id}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded"
                    >
                      <span>{`${obj.name}`}</span>
                      <button
                        onClick={() => deleteVizObj(Number(id))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">
                  Validation Manager
                </h3>
                <ul className="space-y-2">
                  {validationInstance.map((validation, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded"
                    >
                      <span>{validationDescriptions(validation)}</span>
                      <button
                        onClick={() => validationDeletor(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </DialogContent>
          </Dialog>

          {/* Keep existing OrderHandlerDb */}
          <OrderHandlerDB />
        </div>
      </div>
    </>
  );
}
