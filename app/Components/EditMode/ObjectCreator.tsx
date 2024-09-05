import React, { useState } from 'react';
import { useStore } from '@/app/store'; // Adjust the import path as needed
import { obj } from '@/classes/vizobjects/obj'; // Adjust the import path as needed
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import coloredObj from '@/classes/vizobjects/coloredObj';
import {TransformObj} from '@/classes/vizobjects/transformObj';
import {LineObj} from '@/classes/vizobjects/Lineobj';

export type EditAddType = obj | coloredObj; // Extend this type union as needed for other object types
export type PopUpType = obj | coloredObj | TransformObj | LineObj; // Extend this type union as needed for other object types

interface ObjectCreatorProps {
  objectType: 'obj' | 'coloredObj' | 'TransformObj' | 'LineObj'; // Extend this union type as you add more object types
  onClose: () => void;
}

export function ObjectCreator({ objectType, onClose }: ObjectCreatorProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const addElement = useStore((state) => state.addElement);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    onClose();
  };

  const handleSaveObject = (newObject: EditAddType) => {
    addElement(newObject);
    handleClosePopup();
  };

  let PopupComponent: React.ReactElement | null = null;

  switch (objectType) {
    case 'obj':
      PopupComponent = obj.getPopup({
        isOpen: isPopupOpen,
        onClose: handleClosePopup,
        onSave: handleSaveObject,
      });
      break;
    case 'coloredObj':
        PopupComponent = coloredObj.getPopup({
            isOpen: isPopupOpen,
            onClose: handleClosePopup,
            onSave: handleSaveObject,
            });
        break;
    
    case 'TransformObj':
        PopupComponent = TransformObj.getPopup({
            isOpen: isPopupOpen,
            onClose: handleClosePopup,
            onSave: handleSaveObject,
            });
    case 'LineObj':
        PopupComponent = LineObj.getPopup({
            isOpen: isPopupOpen,
            onClose: handleClosePopup,
            onSave: handleSaveObject,
            });

    // Add cases for other object types here
    default:
      console.error(`Unsupported object type: ${objectType}`);
  }

  return (
    // <Dialog open={isPopupOpen} onOpenChange={handleClosePopup}>
    //   <DialogContent>
    //     <DialogHeader>
    //       <DialogTitle>Create New {objectType}</DialogTitle>
    //     </DialogHeader>
    //     {PopupComponent}
    //   </DialogContent>
    // </Dialog>
      PopupComponent
  );
}