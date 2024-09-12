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
  getOrderSelector,
  OrderItem,
  getPlacementSelector2,
  getScore,
  getControlSelector2,
} from "@/app/store";
import { get } from "http";

/*
 * This component is responsible for rendering the order of components in the sidebar
 * It is used in the MiniGame component
 * It is used to render the order of components in the sidebar
 */

export const OrderHandler = ({
  state_name,
}: {
  state_name: keyof typeof initDataSets;
}) => {
  const get_questions = useStore(getQuestionsSelector); // the set of questions for the current state
  const order = useStore(getOrderSelector); // the order of things in the sidebar along with hints
  // note that hints can only be added to questions
  const title = useStore(getTitleSelector);
  const get_placement = useStore(getPlacementSelector2);
  const get_control = useStore(getControlSelector2);
  // const [showHint, setShowHint] = useState<{ [key: number]: boolean }>({});

  // const toggleHint = (index: number) => {
  //   setShowHint(prev => ({ ...prev, [index]: !prev[index] }));
  // };

  const renderComponent = (item: OrderItem, index: number) => {
    // this renders each of the boxes in the sidebar
    // checks the type of the item and renders the relevant component
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
            {item.id == 0 ? (
              <>
                <h2 className="text-lg md:text-xl font-semibold text-blue-800 mb-2">
                  {title}
                </h2>{" "}
              </>
            ) : null}

            <p id={`question-text-${index}`} className="text-gray-700">
              {question ? <Latex>{question}</Latex> : null}
            </p>
            {/* {item.hint && (
              <div className="mt-2">
                <button
                  onClick={() => toggleHint(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {showHint[index] ? "Hide Hint" : "Show Hint"}
                </button>
                {showHint[index] && (
                  <p className="text-gray-600 mt-1">{item.hint}</p>
                )}
              </div>
            )} */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    // render the components for each of the items in the order list
    <div className="space-y-4 md:space-y-6">
      {order.map((item, index) => (
        <React.Fragment key={`${item.type}-${item.id}-${index}`}>
          {renderComponent(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
};
