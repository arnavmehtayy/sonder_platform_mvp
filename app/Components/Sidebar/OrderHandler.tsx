import React, { useState } from "react";
import ShowScore from "../ShowScore";
import ShowControl from "../ShowControls/ShowControl";
import ShowPlacement from "../ShowPlacement";
import Latex from "react-latex-next";
import { initDataSets } from "@/classes/Data/CompleteData";

// Define types for our components
export type ComponentType = "score" | "control" | "placement" | "question" | "hint";

export interface OrderItem {
  type: ComponentType;
  id: number;
  hint?: string;
}

interface OrderHandlerProps {
  state_name: keyof typeof initDataSets;
}

export const OrderHandler: React.FC<OrderHandlerProps> = ({ state_name }) => {
  const questions = initDataSets[state_name].questions;
  const order = initDataSets[state_name].order;
  const title = initDataSets[state_name].title;
  const [showHint, setShowHint] = useState<{ [key: number]: boolean }>({});

  const toggleHint = (index: number) => {
    setShowHint(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const renderComponent = (item: OrderItem, index: number) => {
    console.log(item);
    switch (item.type) {
      case "score":
        console.log(item.id);
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
  return (
    <div className="space-y-4 md:space-y-6">
      {order.map((item, index) => renderComponent(item, index))}
    </div>
  );
};