"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Check,
  X,
  GripVertical,
  Trash2,
  Plus,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Latex from "react-latex-next";
import {
  useStore,
  getQuestionsSelector,
  getTitleSelector,
  getPlacementSelector2,
  getScore,
  OrderItem,
  getControlSelector2,
  setTitleSelector,
  setQuestionSelector,
  getIsVideoPlayingSelector,
  getIsVideoEndedSelector,
} from "@/app/store";
import { useDebounce } from "use-debounce";
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
import { DropDownMenu } from "@/app/Components/EditMode/DropDownMenu";
import {
  Sliders,
  List,
  MousePointerClick,
  Calculator,
  ArrowRightLeft,
  PencilLine,
  Circle,
  LineChart,
  Axis3D,
  Type,
  Variable,
  Table,
  Hash,
  ListChecks,
} from "lucide-react";
import { ObjectCreator } from "@/app/Components/EditMode/ObjectCreator";
import { ObjectType } from "../EditMode/EditBar";
import { SliderControlAdvanced } from "@/classes/Controls/SliderControlAdv";
import { SelectControl } from "@/classes/Controls/SelectControl";
import Placement from "@/classes/Placement";
import { InfluenceAdvanced } from "@/classes/influenceAdv";
import { FunctionScore } from "@/classes/Scores/FunctionScore";
import { Question } from "@/classes/Question";
import { MultiChoiceClass } from "@/classes/Controls/MultiChoiceClass";
import { TableControl } from "@/classes/Controls/TableControl";
import { InputNumber } from "@/classes/Controls/InputNumber";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ValidationMultiChoice } from "@/classes/Validation/ValidationMultiChoice";
import { useParams } from "next/navigation";
import Validation_sliderAdv from "@/classes/Validation/Validation_sliderAdv";
import { Validation_inputNumber } from "@/classes/Validation/Validation_inputNumber";

/*
 * This component is responsible for rendering the order of components in the sidebar
 * It is used in the MiniGame component
 * It is used to render the order of components in the sidebar
 */

// Add SortableItem component
function SortableItem({
  id,
  children,
  isEditMode,
  onDelete,
}: {
  id: string;
  children: React.ReactNode;
  isEditMode: boolean;
  onDelete?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isTextItem = id.startsWith("question-");
  const containerClass = isTextItem
    ? "mb-2"
    : "bg-white rounded-lg shadow-sm mb-2";

  if (!isEditMode) {
    return (
      <div className={containerClass}>
        <div className="flex-1">{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center ${containerClass}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-move p-2 text-gray-400 hover:text-gray-600"
      >
        <GripVertical size={16} />
      </div>
      <div className="flex-1">{children}</div>
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export const OrderHandlerDB = ({
  isEditMode = false,
}: {
  isEditMode?: boolean;
}) => {
  const state = useStore();
  const get_questions = useStore(getQuestionsSelector);
  const title = useStore(getTitleSelector);
  const get_placement = useStore(getPlacementSelector2);
  const get_control = useStore(getControlSelector2);
  const setTitle = useStore(setTitleSelector);
  const setQuestion = useStore(setQuestionSelector);
  const deleteVizObj = useStore((state) => state.deleteVizObj);
  const deleteControl = useStore((state) => state.deleteControl);
  const deleteQuestion = useStore((state) => state.deleteQuestion);
  const deletePlacement = useStore((state) => state.deletePlacement);
  const deleteOrderItem = useStore((state) => state.deleteOrderItem);
  const deleteInfluences = useStore((state) => state.deleteInfluences);
  const deleteScore = useStore((state) => state.deleteScore);

  // Get params at component level
  const params = useParams();
  const expId = parseInt(params.ExpID as string);
  const currentIndex = parseInt(params.index as string);

  // Title editing state
  const [localTitle, setLocalTitle] = useState(title);
  const [debouncedTitle] = useDebounce(localTitle, 500);

  // Question editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");

  // Add new state for title editing
  const [isTitleEditing, setIsTitleEditing] = useState(false);

  // Add new state for object creation
  const [selectedObjectType, setSelectedObjectType] =
    useState<ObjectType | null>(null);

  // Add DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const controlTypes: ObjectType[] = [
    { name: "Text", type: Question, icon: Type },
    { name: "Slider", type: SliderControlAdvanced, icon: Sliders },
    // { name: "Object Picker", type: SelectControl, icon: List },
    // { name: "Object Placer", type: Placement, icon: MousePointerClick },
    // { name: "Score", type: FunctionScore, icon: Calculator },
    { name: "MCQ", type: MultiChoiceClass, icon: ListChecks },
    // { name: "Table Question", type: TableControl, icon: Table },
    { name: "Number Input", type: InputNumber, icon: Hash },
  ];

  // Add drag end handler
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = state.order.findIndex(
        (item) => `${item.type}-${item.id}` === active.id
      );
      const newIndex = state.order.findIndex(
        (item) => `${item.type}-${item.id}` === over.id
      );
      const newOrder = [...state.order];
      const [reorderedItem] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, reorderedItem);
      state.setOrder(newOrder);
    }
  };

  React.useEffect(() => {
    setTitle(debouncedTitle);
  }, [debouncedTitle, setTitle]);

  React.useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  const handleEdit = (id: number, text: string) => {
    setEditingId(id);
    setEditedText(text);
  };

  const handleSave = (id: number) => {
    setQuestion(id, editedText);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedText("");
  };

  const handleTitleEdit = () => {
    setIsTitleEditing(true);
    setLocalTitle(title);
  };

  const handleTitleSave = () => {
    setTitle(localTitle);
    setIsTitleEditing(false);
  };

  const handleTitleCancel = () => {
    setLocalTitle(title);
    setIsTitleEditing(false);
  };

  const renderComponent = (item: OrderItem, index: number) => {
    switch (item.type) {
      case "score":
        return getScore(item.id)?.render();
      case "control":
        return get_control(item.id)?.render();
      case "placement":
        return get_placement(item.id)?.render();
      case "question":
        const question = get_questions(item.id as number);
        return (
          <div key={`question-${index}`} className="p-4">
            {item.id == 0 ? null : (
              <>
                {editingId === item.id ? (
                  <div className="space-y-3 bg-white rounded-lg shadow-md p-4">
                    <div>
                      <Label className="text-xs text-gray-500">
                        Question Text
                      </Label>
                      <Textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="min-h-[100px] p-2 text-gray-700 border rounded resize-none focus:ring-2 focus:ring-blue-500 mt-1"
                        placeholder="Enter question text..."
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleSave(item.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start px-0">
                    <div className="text-gray-700">
                      {question ? <Latex>{question}</Latex> : null}
                    </div>
                    {isEditMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-black-400 hover:text-blue-500"
                        onClick={() => handleEdit(item.id, question || "")}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Add delete handler
  const handleDeleteItem = (id: number, type: string) => {
    // First delete the order item
    deleteOrderItem(id, type);

    // Handle specific type deletions
    if (type === "control") {
      deleteControl(id);
    } else if (type === "placement") {
      deletePlacement(id);
    } else if (type === "question") {
      deleteQuestion(id);
    } else if (type === "score") {
      deleteScore(id);
    }
  };

  // Add video state selectors
  const isVideoPlaying = useStore(getIsVideoPlayingSelector);
  const isVideoEnded = useStore(getIsVideoEndedSelector);

  // Add cleanup function
  const handleObjectCreatorClose = () => {
    setSelectedObjectType(null);
    // Reset any stuck dialog states
    requestAnimationFrame(() => {
      document.body.style.pointerEvents = "";
      const dialogs = document.querySelectorAll('[role="dialog"]');
      dialogs.forEach((dialog) => {
        if (dialog.parentElement) {
          dialog.parentElement.style.pointerEvents = "";
        }
      });
    });
  };

  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [questionDescription, setQuestionDescription] = useState("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] =
    useState<string>("multichoice");

  // Update the handleGenerateQuestions function
  const handleGenerateQuestions = async () => {
    try {
      setIsGeneratingQuestions(true);

      // useStore.setState({
      //   order: [],
      //   vizobjs: {},
      //   title: "",
      //   questions: {},
      //   controls: {},
      //   placement: {},
      //   scores: {},
      //   validations: [],
      //   influenceAdvIndex: {},
      // }); // reset state

      const response = await fetch("/api/supabase/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceId: expId,
          index: currentIndex,
          description: questionDescription,
          questionType: selectedQuestionType, // Pass the selected question type
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to generate questions: ${errorData.error}`);
      }

      const questionData = await response.json();
      console.log(questionData);

      // Set the title from the API response
      if (questionData.title) {
        setTitle(questionData.title.replace(/['"]/g, ''));
        setLocalTitle(questionData.title.replace(/['"]/g, '')); // Update local title state too
      }

      // Handle different question types
      if (selectedQuestionType === "multichoice") {
        // Create a new MultiChoiceClass instance
        const newMultiChoice = {
          id: Date.now() % 10000,
          desc: questionData.question,
          text: "Select the correct answer:",
          options: questionData.options,
          isMultiSelect: false,
          type: "MultiChoiceClass",
        };

        // Add the control to the state
        const newControl = new MultiChoiceClass({
          id: newMultiChoice.id,
          desc: newMultiChoice.desc,
          text: newMultiChoice.text,
          options: newMultiChoice.options,
          isMultiSelect: newMultiChoice.isMultiSelect,
        });
        useStore.getState().addElement(newControl);

        // Create validation for the question
        const newValidation = new ValidationMultiChoice({
          answer: questionData.correctAnswers,
          control_id: newMultiChoice.id,
          desc: `${newMultiChoice.desc}`,
        });
        useStore.getState().addElement(newValidation);

        console.log(newValidation, newMultiChoice);
      } else if (selectedQuestionType === "slider") {
        // Create a new SliderControlAdvanced instance
        const newSlider = {
          id: Date.now() % 10000,
          desc: questionData.question,
          text:
            questionData.instructions ||
            "Adjust the slider to the correct value:",
          range: questionData.range || [0, 100],
          step_size: questionData.stepSize || 1,
          obj_id: -1,
          attribute_pairs: [],
        };

        // Add the control to the state
        const newControl = new SliderControlAdvanced(newSlider);
        useStore.getState().addElement(newControl);

        // Create validation for the question
        const newValidation = new Validation_sliderAdv({
          control_id: newSlider.id,
          target_value: questionData.targetValue,
          error: questionData.tolerance || 1,
          relation: "==",
          desc: `${newSlider.desc}`,
        });
        useStore.getState().addElement(newValidation);

        console.log(newValidation, newControl);
      } else if (selectedQuestionType === "number") {
        // Create a new InputNumber instance
        const newInput = {
          id: Date.now() % 10000,
          desc: questionData.question,
          text:
            questionData.instructions || "Enter the correct numerical answer:",
          value: 0,
          placeholder: "Enter your answer",
          min: questionData.min,
          max: questionData.max,
          step: questionData.step || 0.01,
        };

        // Add the control to the state
        const newControl = new InputNumber(newInput);
        useStore.getState().addElement(newControl);

        // Create validation for the question
        const newValidation = new Validation_inputNumber({
          answer: questionData.answer,
          control_id: newInput.id,
          error: questionData.tolerance || 0.1,
          desc: `${newInput.desc}`,
        });
        useStore.getState().addElement(newValidation);

        console.log(newValidation, newControl);
      }

      toast.success("Question generated successfully");

      // Clear the description field and close the dropdown after successful generation
      setQuestionDescription("");
      setIsDescriptionExpanded(false);
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate questions");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const [isAIMode, setIsAIMode] = useState(true);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Title section - always visible */}
      <div className="p-4">
        {isTitleEditing && isEditMode ? (
          <div className="space-y-3 bg-white rounded-lg shadow-md p-4">
            <div>
              <Label className="text-xs text-gray-500">Title</Label>
              <Input
                type="text"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                className="text-lg font-semibold text-blue-800"
                placeholder="Enter title..."
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTitleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleTitleSave}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <h2 className="text-lg md:text-xl font-semibold text-blue-800">
              <Latex>{localTitle}</Latex>
            </h2>
            {isEditMode && (
              <Button
                variant="ghost"
                size="sm"
                className="text-black-400 hover:text-blue-500"
                onClick={handleTitleEdit}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main content - show based on conditions */}
      {(isEditMode || (isVideoEnded && !isVideoPlaying)) && (
        <>
          {/* Content area */}
          {isEditMode ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={state.order.map((item) => `${item.type}-${item.id}`)}
                strategy={verticalListSortingStrategy}
              >
                {state.order.map((item, index) => (
                  <SortableItem
                    key={`${item.type}-${item.id}-${index}`}
                    id={`${item.type}-${item.id}`}
                    isEditMode={isEditMode}
                    onDelete={() => handleDeleteItem(item.id, item.type)}
                  >
                    {renderComponent(item, index)}
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            <div>
              {state.order.map((item, index) => (
                <SortableItem
                  key={`${item.type}-${item.id}-${index}`}
                  id={`${item.type}-${item.id}`}
                  isEditMode={false}
                >
                  {renderComponent(item, index)}
                </SortableItem>
              ))}
            </div>
          )}

          {/* Replace dropdown with direct component buttons - improved UI with clearer purpose */}
          {isEditMode && (
            <div className="mt-8 px-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Plus
                      className={`h-4 w-4 ${
                        isAIMode ? "text-purple-200" : "text-blue-500"
                      } mr-2`}
                    />
                    <h3
                      className={`text-sm font-medium ${
                        isAIMode ? "text-purple-700" : "text-blue-700"
                      }`}
                    >
                      Add Question
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">AI Mode</span>
                    <button
                      onClick={() => setIsAIMode(!isAIMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isAIMode ? "bg-purple-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          isAIMode ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {!isAIMode ? (
                  <div className="grid grid-cols-2 gap-2">
                    {controlTypes.map((objectType) => (
                      <button
                        key={objectType.type.name}
                        onClick={() => setSelectedObjectType(objectType)}
                        className="flex items-center p-3 bg-white rounded-md border border-gray-100 hover:border-blue-300 hover:bg-blue-100 transition-all duration-200"
                      >
                        <objectType.icon className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                        <span className="text-xs text-gray-700 font-medium">
                          {objectType.name}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <button
                        onClick={() => setSelectedQuestionType("multichoice")}
                        className={`p-1 rounded-md flex items-center justify-center gap-1 transition-colors ${
                          selectedQuestionType === "multichoice"
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <ListChecks size={16} />
                        <span>Multiple Choice</span>
                      </button>
                      <button
                        onClick={() => setSelectedQuestionType("slider")}
                        className={`p-1 rounded-md flex items-center justify-center gap-1 transition-colors ${
                          selectedQuestionType === "slider"
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <Sliders size={16} />
                        <span>Slider</span>
                      </button>
                      <button
                        onClick={() => setSelectedQuestionType("number")}
                        className={`p-1 rounded-md flex items-center justify-center gap-1 transition-colors ${
                          selectedQuestionType === "number"
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <Hash size={16} />
                        <span>Number</span>
                      </button>
                    </div>

                    <Textarea
                      placeholder={
                        selectedQuestionType === "multichoice"
                          ? "Describe the multiple choice question you want..."
                          : selectedQuestionType === "slider"
                          ? "Describe the slider question you want..."
                          : "Describe the numerical question you want..."
                      }
                      value={questionDescription}
                      onChange={(e) => setQuestionDescription(e.target.value)}
                      className="min-h-[80px] border-gray-200 focus:border-purple-300 resize-none mb-3 w-full"
                    />

                    <button
                      onClick={handleGenerateQuestions}
                      disabled={isGeneratingQuestions}
                      className="w-full flex items-center justify-center gap-2 p-3 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 transition-all duration-300 disabled:opacity-70"
                    >
                      {isGeneratingQuestions ? (
                        <>
                          <RefreshCw size={18} className="animate-spin" />
                          <span>Generating Question...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} />
                          <span>Generate AI Question</span>
                        </>
                      )}
                    </button>

                    {isGeneratingQuestions && (
                      <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                          <p className="text-sm text-gray-600">
                            Creating a{" "}
                            {selectedQuestionType === "multichoice"
                              ? "multiple choice"
                              : selectedQuestionType === "slider"
                              ? "slider"
                              : "numerical"}{" "}
                            question...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Object Creator - only in edit mode */}
          {selectedObjectType && isEditMode && !isAIMode && (
            <ObjectCreator
              ObjectType={selectedObjectType.type}
              onClose={handleObjectCreatorClose}
            />
          )}
        </>
      )}
    </div>
  );
};
