import { PlacementActivationButton } from "./three/PlacementControl";
import { useStore, getPlacementSelector } from "../store";


/* 
  Given a placement_id returns the UI for the relevant placement
  this generates a setActive/setInactive; reset button and a description of the placement
*/ 
export default function ShowPlacement({id}: {id: number}) {
    const placement = useStore(getPlacementSelector(id));

    const isActive = placement?.isClickable || false;
    
    if (placement) {
      return (
        <div className={`bg-white rounded-lg shadow-md p-4 ${!isActive&& 'opacity-50'}`}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">{placement.desc}</h3>
              <p className="text-gray-600 mb-2">{placement.text}</p>
            </div>
            <PlacementActivationButton isActive={isActive} placement_id={id}/>
          </div>
        </div>
      );
    }
    return null;
  }