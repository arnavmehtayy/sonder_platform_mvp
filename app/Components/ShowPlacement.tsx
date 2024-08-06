import { PlacementActivationButton } from "./three/PlacementControl";
import { useStore, getPlacementSelector } from "../store";

export default function ShowPlacement() {
    const placement = useStore(getPlacementSelector);

    const isActive = placement?.isClickable || false;
    
    if (placement) {
      return (
        <div className={`bg-white rounded-lg shadow-md p-4 ${!isActive&& 'opacity-50'}`}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">{placement.desc}</h3>
              <p className="text-gray-600 mb-2">{placement.text}</p>
            </div>
            <PlacementActivationButton totalPlacements={placement?.object_ids.length} isActive={isActive}/>
          </div>
        </div>
      );
    }
    return null;
  }