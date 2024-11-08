"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
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
  setQuestionSelector
} from "@/app/store";
import { useDebounce } from "use-debounce";

/*
 * This component is responsible for rendering the order of components in the sidebar
 * It is used in the MiniGame component
 * It is used to render the order of components in the sidebar
 */

export const OrderHandlerDB = ({ isEditMode = false }: { isEditMode?: boolean }) => {
  const state = useStore();
  const get_questions = useStore(getQuestionsSelector);
  const title = useStore(getTitleSelector);
  const get_placement = useStore(getPlacementSelector2);
  const get_control = useStore(getControlSelector2);
  const setTitle = useStore(setTitleSelector);
  const setQuestion = useStore(setQuestionSelector);

  // Title editing state
  const [localTitle, setLocalTitle] = useState(title);
  const [debouncedTitle] = useDebounce(localTitle, 500);

  // Question editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");

  // Add new state for title editing
  const [isTitleEditing, setIsTitleEditing] = useState(false);

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
                  <div className="flex justify-between items-start">
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
      {state.order.map((item, index) => (
        <React.Fragment key={`${item.type}-${item.id}-${index}`}>
          {renderComponent(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
};
