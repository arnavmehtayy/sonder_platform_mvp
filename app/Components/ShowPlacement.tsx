import React from 'react';
import { PlacementActivationButton } from "./three/PlacementControl";
import { useStore, getPlacementSelector } from "../store";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Placement from '@/classes/Placement';
import { InlinePlacementEdit } from '@/classes/Controls/InlineEdit/InLinePlacementEdit';
function ShowPlacementControl({ 
  placement, 
  onEdit 
}: { 
  placement: Placement;
  onEdit?: () => void;
}) {
  const isActive = placement?.isClickable || false;
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${!isActive && 'opacity-50'} relative`}>
      {onEdit && (
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute right-2 top-2 z-10" 
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">{placement.desc}</h3>
          <p className="text-gray-600 mb-2">{placement.text}</p>
        </div>
        <PlacementActivationButton isActive={isActive} placement_id={placement.id}/>
      </div>
    </div>
  );
}

export default function ShowPlacement({id}: {id: number}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const placement = useStore(getPlacementSelector(id));
  const isEditMode = useStore(state => state.isEditMode);
  
  if (!placement) return null;

  if (isEditing && isEditMode) {
    return <InlinePlacementEdit 
      placement={placement} 
      onClose={() => setIsEditing(false)} 
    />;
  }
  
  return <ShowPlacementControl 
    placement={placement} 
    onEdit={isEditMode ? () => setIsEditing(true) : undefined}
  />;
}