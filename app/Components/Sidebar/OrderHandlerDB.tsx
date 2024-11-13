"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X, GripVertical, Trash2 } from "lucide-react";
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
  onDelete 
}: { 
  id: string; 
  children: React.ReactNode;
  isEditMode: boolean;
  onDelete?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isTextItem = id.startsWith('question-');
  const containerClass = isTextItem 
    ? "mb-2" 
    : "bg-white rounded-lg shadow-sm mb-2";

  if (!isEditMode) {
    return (
      <div className={containerClass}>
        <div className="flex-1">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-center ${containerClass}`}
    >
      <div {...attributes} {...listeners} className="cursor-move p-2 text-gray-400 hover:text-gray-600">
        <GripVertical size={16} />
      </div>
      <div className="flex-1">
        {children}
      </div>
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

export const OrderHandlerDB = ({ isEditMode = false }: { isEditMode?: boolean }) => {
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

  // Add DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
                      <Label className="text-xs text-gray-500">Question Text</Label>
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
    if (type === 'control') {
      deleteControl(id);
    } else if (type === 'placement') {
      deletePlacement(id);
    } else if (type === 'question') {
      deleteQuestion(id);
    }
    else if (type === 'score') {
      deleteScore(id);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="p-4">
        {isTitleEditing ? (
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

      {isEditMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={state.order.map(item => `${item.type}-${item.id}`)}
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
    </div>
  );
};
