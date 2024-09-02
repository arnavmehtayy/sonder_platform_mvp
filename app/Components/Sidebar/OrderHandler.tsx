import React, { useState } from "react";
import ShowScore from "../ShowScore";
import ShowControl from "../ShowControls/ShowControl";
import ShowPlacement from "../ShowPlacement";
import Latex from "react-latex-next";
import { initDataSets } from "@/classes/Data/CompleteData";

/*
 * This component is responsible for rendering the order of components in the sidebar
 * It is used in the MiniGame component
 * It is used to render the order of components in the sidebar
 */

// Define types for our components
export type ComponentType = "score" | "control" | "placement" | "question";

export interface OrderItem {
  type: ComponentType; 
  id: number;
  hint?: string;
}

interface OrderHandlerProps {
  state_name: keyof typeof initDataSets;
}

export const OrderHandler: React.FC<OrderHandlerProps> = ({ state_name }) => {

  const questions = initDataSets[state_name].questions; // the set of questions for the current state
  const order = initDataSets[state_name].order; // the order of things in the sidebar along with hints
  // note that hints can only be added to questions
  const title = initDataSets[state_name].title;
  const [showHint, setShowHint] = useState<{ [key: number]: boolean }>({});

  const toggleHint = (index: number) => {
    setShowHint(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const renderComponent = (item: OrderItem, index: number) => {
    // this renders each of the boxes in the sidebar
    // checks the type of the item and renders the relevant component
    switch (item.type) {
      case "score":
        return (
          <ShowScore key={`score-${index}`} score_id={item.id as number} />
        );
      case "control":
        return (
          <ShowControl
            key={`control-${index}`}
            control_id={item.id as number}
          />
        );
      case "placement":
        return <ShowPlacement key={`placement-${index}`} />;
      case "question":
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
              {item.id < questions.length ? (
                <Latex>{questions[item.id as number]}</Latex>
              ) : null}
            </p>
            {item.hint && (
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
            )}
          </div>
        );
      default:
        return null;
    }
  };
  return ( // render the components for each of the items in the order list
    <div className="space-y-4 md:space-y-6">
      {order.map((item, index) => renderComponent(item, index))}
    </div>
  );
};