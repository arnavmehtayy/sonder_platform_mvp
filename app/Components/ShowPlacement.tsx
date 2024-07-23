import { PlacementActivationButton } from "./three/PlacementControl";
import { useStore, getPlacementSelector } from "../store";
import { useState } from "react";

export default function ShowPlacement() {
  const placement = useStore(getPlacementSelector);
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-blue-800">Selection 6</h3>
        {placement && (
          <PlacementActivationButton
            totalPlacements={placement?.object_ids.length}
          />
        )}
      </div>
      <p className="text-sm text-gray-600 mb-2">
        Click to place objects on the grid
      </p>
    </div>
  );
}
