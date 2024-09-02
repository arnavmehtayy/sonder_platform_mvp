"use client";
import React, { use, useEffect, useState } from "react";
import Experience from "../visualexp";
import Link from "next/link";
import ShowControl from "../ShowControls/ShowControl";
import ShowScore from "../ShowScore";
import {
  useStore,
  getStateName,
  getPlacementSelector,
  UpdateValidationSelector,
} from "@/app/store";
import { initDataSets, experiences } from "@/classes/Data/CompleteData";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import {
  PlacementProvider,
  PlacementControl,
  PlacementActivationButton,
} from "../three/PlacementControl";
import ShowPlacement from "../ShowPlacement";
import "../style.css";
import ValidationComponent from "../ShowValid";
import { useRouter } from "next/router";
import { FeedbackComponent } from "../MainMenu/FeedbackComponent";
import MultiChoice from "../ShowControls/ShowMultiChoice";
import ShowInputNumber from "../ShowControls/ShowInputNumber";
import { OrderHandler, OrderItem } from "./OrderHandler";
import { Instance } from "@react-three/drei";

export function MinigameEdit({
}: {
}) {
  // console.log("Page: ", page);
  const reset = useStore((state) => state.reset);
  const state_name = useStore(getStateName);
  const placement = useStore(getPlacementSelector);

  // const router = useRouter();
  const updateValidation = useStore(UpdateValidationSelector);
  const validationInstance = useStore((state) => state.validations);

  const handleValidationUpdate = () => {
    updateValidation();
  };

  useEffect(() => 
    reset("default")
  , []);


  // console.log(initDataSets[state_name].controlData)

  // testing

  // if(state_name) {
  // initDataSets[state_name].controlData
  // }



  const [allValidationsValid, setAllValidationsValid] = useState(false);

  useEffect(() => {
    const checkAllValidations = () => {
      const allValid = validationInstance.every(validation => validation.get_isValid());
      setAllValidationsValid(allValid);
    };

    checkAllValidations();
  }, [validationInstance]);

  return (
    <PlacementProvider length={placement?.object_ids.length || 0}>
      <div className="flex flex-col md:flex-row h-screen bg-gray-100">
        {/* Main Three.js Experience */}
        <div className="flex-grow bg-black h-1/2 md:h-full md:flex-1">
          <Experience /> {/* Three.js experience */}
        </div>

        {/* Sidebar */}
        <div
          className="w-full md:w-1/3 md:min-w-[300px] md:max-w-md bg-blue-50 p-4 overflow-y-auto h-1/2 md:h-full"
          style={{ height: "100lvh" }}
        >
          <div className="space-y-4 md:space-y-6">
            <OrderHandler state_name={state_name} />

            {/* Add the ValidationComponent here */}
            <div className="mt-auto">
        <ValidationComponent
          validations={validationInstance}
          updater={handleValidationUpdate}
        />
        
      </div>
          </div>

          <br />
          <br />
          <br />
        </div>
      </div>
    </PlacementProvider>
  );
}
