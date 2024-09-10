import React, { useState } from 'react';
import { useStore } from '@/app/store';
import { obj } from '@/classes/vizobjects/obj';
import coloredObj from '@/classes/vizobjects/coloredObj';
import { TransformObj } from '@/classes/vizobjects/transformObj';
import { LineObj } from '@/classes/vizobjects/Lineobj';
import { geomobj } from '@/classes/vizobjects/geomobj';
import CoordinateAxis from '@/classes/vizobjects/CoordinateAxis';
import { Question } from '@/classes/Question';
import { Control } from '@/classes/Controls/Control';
import { MultiChoiceClass } from '@/classes/Controls/MultiChoiceClass';

export type EditAddType = obj | coloredObj | TransformObj | LineObj | Question | MultiChoiceClass;
export type PopUpType = typeof LineObj | typeof geomobj | typeof CoordinateAxis | typeof Question | typeof MultiChoiceClass; // add more to this

interface ObjectCreatorProps {
  ObjectType: PopUpType;
  onClose: () => void;
}

export function ObjectCreator({ ObjectType, onClose }: ObjectCreatorProps) {
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

  // Use the static getPopup method from the ObjectType
  const PopupComponent = ObjectType.getPopup({
    isOpen: isPopupOpen,
    onClose: handleClosePopup,
    onSave: handleSaveObject,
  });

  return PopupComponent;
}