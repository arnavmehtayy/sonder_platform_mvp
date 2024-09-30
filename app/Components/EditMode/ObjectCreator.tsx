import React, { useState } from "react";
import { useStore } from "@/app/store";
import { obj } from "@/classes/vizobjects/obj";
import coloredObj from "@/classes/vizobjects/coloredObj";
import { TransformObj } from "@/classes/vizobjects/transformObj";
import { LineObj } from "@/classes/vizobjects/Lineobj";
import { geomobj } from "@/classes/vizobjects/geomobj";
import CoordinateAxis from "@/classes/vizobjects/CoordinateAxis";
import { Question } from "@/classes/Question";
import { Control } from "@/classes/Controls/Control";
import { MultiChoiceClass } from "@/classes/Controls/MultiChoiceClass";
import { SliderControlAdvanced } from "@/classes/Controls/SliderControlAdv";
import { InputNumber } from "@/classes/Controls/InputNumber";
import { SelectControl } from "@/classes/Controls/SelectControl";
import { EnablerControl } from "@/classes/Controls/EnablerControl";
import { TableControl } from "@/classes/Controls/TableControl";
import TextGeom from "@/classes/vizobjects/textgeomObj";
import FunctionPlotString from "@/classes/vizobjects/FunctionPlotString";
import { DummyDataStorage } from "@/classes/vizobjects/DummyDataStore";

export type EditAddType =
  | obj
  | coloredObj
  | TransformObj
  | LineObj
  | Question
  | MultiChoiceClass
  | SliderControlAdvanced<any>
  | InputNumber
  | SelectControl
  | EnablerControl
  | TableControl<obj> 
  | TextGeom
  | FunctionPlotString
  | DummyDataStorage<any>;
  
export type PopUpType = 
  | typeof LineObj
  | typeof geomobj
  | typeof CoordinateAxis
  | typeof Question
  | typeof MultiChoiceClass // add more to this
  | typeof SliderControlAdvanced<any>
  | typeof InputNumber 
  | typeof SelectControl
  | typeof EnablerControl
  | typeof TableControl 
  | typeof TextGeom
  | typeof FunctionPlotString
  | typeof DummyDataStorage<any>;
  

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
