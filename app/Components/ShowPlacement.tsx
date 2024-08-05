import { PlacementActivationButton } from "./three/PlacementControl";
import { useStore, getPlacementSelector } from "../store";

export default function ShowPlacement() {
    const placement = useStore(getPlacementSelector);
    
    if (placement) {
      return (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">{placement.desc}</h3>
              <p className="text-sm text-gray-600 mb-2">{placement.text}</p>
            </div>
            <PlacementActivationButton totalPlacements={placement?.object_ids.length} />
          </div>
        </div>
      );
    }
    return null;
  }