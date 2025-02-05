"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X, GripVertical, Trash2, Plus } from "lucide-react";
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
    { name: "SliderControl", type: SliderControlAdvanced, icon: Sliders },
    // { name: "Object Picker", type: SelectControl, icon: List },
    // { name: "Object Placer", type: Placement, icon: MousePointerClick },
    // { name: "Score", type: FunctionScore, icon: Calculator },
    { name: "MCQ", type: MultiChoiceClass, icon: ListChecks },
    { name: "Table Question", type: TableControl, icon: Table },
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

          {/* Add Component button - only in edit mode */}
          {isEditMode && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="mt-8 relative">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-transparent hover:border-blue-300 hover:bg-blue-50 transform transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-visible">
                    <div className="flex flex-col items-center justify-center">
                      <Plus className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                      <h3 className="text-lg font-medium text-gray-600 group-hover:text-gray-700 mb-2">
                        Add Sidebar Component
                      </h3>
                    </div>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-white rounded-lg shadow-xl p-2 mt-2 w-56 border border-gray-100 z-[100]"
                align="center"
                sideOffset={5}
                alignOffset={0}
              >
                {controlTypes.map((objectType) => (
                  <DropdownMenuItem
                    key={objectType.type.name}
                    onSelect={() => setSelectedObjectType(objectType)}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 rounded-md transition-all duration-200 cursor-pointer group"
                  >
                    <objectType.icon className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
                    <span className="text-gray-700 font-medium group-hover:text-gray-900">
                      {objectType.name}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Object Creator - only in edit mode */}
          {selectedObjectType && isEditMode && (
            <ObjectCreator
              ObjectType={selectedObjectType.type}
              onClose={() => setSelectedObjectType(null)}
            />
          )}
        </>
      )}
    </div>
  );
};
