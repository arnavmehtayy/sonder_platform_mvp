"use client";
import React, { useState } from "react";
import { HelpCircle, List, ChevronDown, Plus, Trash2, ArrowRightLeft } from "lucide-react";
import { 
  LineChart, 
  Circle, 
  Axis3D, 
  ListChecks, 
  Sliders,
  PencilLine,
} from 'lucide-react';
import { useStore, addQuestionEditor, addMCQuestionEditor, getNameSelector, getSideBarName } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Latex from "react-latex-next";
import { ObjectCreator, PopUpType } from "./ObjectCreator";
import coloredObj from "@/classes/vizobjects/coloredObj";
import { obj } from "@/classes/vizobjects/obj";
import { TransformObj } from "@/classes/vizobjects/transformObj";
import { LineObj } from "@/classes/vizobjects/Lineobj";
import { geomobj } from "@/classes/vizobjects/geomobj";
import FunctionPlotString from "@/classes/vizobjects/FunctionPlotString";
import CoordinateAxis from "@/classes/vizobjects/CoordinateAxis";
import { Question } from "@/classes/Question";
import { MultiChoiceClass } from "@/classes/Controls/MultiChoiceClass";
import { DropDownMenu } from "./DropDownMenu";
import { SliderControlAdvanced } from "@/classes/Controls/SliderControlAdv";
import { InputNumber } from "@/classes/Controls/InputNumber";
import { SelectControl } from "@/classes/Controls/SelectControl";
import { EnablerControl } from "@/classes/Controls/EnablerControl";
import { TableControl } from "@/classes/Controls/TableControl";
import TextGeom from "@/classes/vizobjects/textgeomObj";
import { DummyDataInput } from "./EditPopups/DummyDataInput";
import { DummyDataStorage } from "@/classes/vizobjects/DummyDataStore";
import { FunctionScore } from "@/classes/Scores/FunctionScore";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DialogTrigger } from "@radix-ui/react-dialog";
import { GripVertical } from 'lucide-react';
import { ToggleLeft, Type, Variable, Table, Calculator, Hash, MousePointerClick} from 'lucide-react';
import Placement from "@/classes/Placement";
import { InfluenceAdvanced } from "@/classes/influenceAdv";

export interface Option {
  id: number;
  label: string;
}

export interface ObjectType {
  name: string;
  type: PopUpType;
  icon: React.ElementType;
}





export const EditBar: React.FC = () => {
  const [selectedObjectType, setSelectedObjectType] = useState<ObjectType | null>(null);



  const controlTypes: ObjectType[] = [
    { name: "SliderControl", type: SliderControlAdvanced, icon: Sliders },
    {name: "Object Picker", type: SelectControl, icon: List},
    // {name: "Hide/Show Object", type: EnablerControl, icon: ToggleLeft},
    {name: "Object Placer", type: Placement, icon: MousePointerClick},
    {name: "Score", type: FunctionScore, icon: Calculator},
    {name: "Influence", type: InfluenceAdvanced, icon: ArrowRightLeft}
  ];
    
  const objectTypes: ObjectType[] = [
    { name: "Line Object", type: LineObj, icon: PencilLine},
    { name: "Geom Object", type: geomobj, icon: Circle },
    { name: "Function Object", type: FunctionPlotString, icon: LineChart },
    { name: "Axis Object", type: CoordinateAxis, icon: Axis3D },
    {name: "Text Object", type: TextGeom, icon: Type},
    {name: "Variable", type: DummyDataStorage, icon: Variable}
  ];

  const questionTypes: ObjectType[] = [
    { name: "Text", type: Question, icon: Type },
    { name: "MCQ", type: MultiChoiceClass, icon: ListChecks },
    {name: "Table Question", type: TableControl, icon: Table},
    {name: "Number Input", type: InputNumber, icon: Hash},
  ];


  

  


  return (
    <>
      <div className="fixed top-4 left-[33%] ml-[8.33%] transform -translate-x-1/2 z-10 flex space-x-2 z-[100]">
        <DropDownMenu
          ObjectList={controlTypes}
          setSelectedObjectType={setSelectedObjectType}
          label="Control"
        />
        <DropDownMenu
          ObjectList={questionTypes}
          setSelectedObjectType={setSelectedObjectType}
          label="Question"
        />
        <DropDownMenu
          ObjectList={objectTypes}
          setSelectedObjectType={setSelectedObjectType}
          label="Object"
        />
      </div>

      {selectedObjectType && (
        <ObjectCreator
          ObjectType={selectedObjectType.type}
          onClose={() => setSelectedObjectType(null)}
        />
      )}
    </>
  );
};