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
  OrderItem
} from "@/app/store";

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
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {state.order.map((item, index) => (
        <React.Fragment key={`${item.type}-${item.id}-${index}`}>
          {renderComponent(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
};
