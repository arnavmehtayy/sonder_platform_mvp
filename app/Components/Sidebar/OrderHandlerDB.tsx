"use client";
import React, { useState } from "react";
import ShowScore from "../ShowScore";
import ShowControl from "../ShowControl";
import ShowPlacement from "../ShowPlacement";
import Latex from "react-latex-next";
import { initDataSets } from "@/classes/Data/CompleteData";
import {
  useStore,
  getQuestionsSelector,
  getTitleSelector,
  getPlacementSelector2,
  getScore,
  getControlSelector2,
  State,
  OrderItem,
  setTitleSelector
} from "@/app/store";
import { useDebounce } from "use-debounce";

/*
 * This component is responsible for rendering the order of components in the sidebar
 * It is used in the MiniGame component
 * It is used to render the order of components in the sidebar
 */

export const OrderHandlerDB = () => {
  const state = useStore();
  const get_questions = useStore(getQuestionsSelector);
  const title = useStore(getTitleSelector);
  const get_placement = useStore(getPlacementSelector2);
  const get_control = useStore(getControlSelector2);
  const setTitle = useStore(setTitleSelector);

  const [localTitle, setLocalTitle] = useState(title);
  const [debouncedTitle] = useDebounce(localTitle, 500);

  React.useEffect(() => {
    setTitle(debouncedTitle);
  }, [debouncedTitle, setTitle]);

  React.useEffect(() => {
    setLocalTitle(title);
  }, [title]);

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
              <p id={`question-text-${index}`} className="text-gray-700">
                {question ? <Latex>{question}</Latex> : null}
              </p>
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
        <input
          type="text"
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          className="w-full text-lg md:text-xl font-semibold text-blue-800 bg-transparent border-none focus:outline-none"
          placeholder="Enter title..."
        />
      </div>
      {state.order.map((item, index) => (
        <React.Fragment key={`${item.type}-${item.id}-${index}`}>
          {renderComponent(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
};
