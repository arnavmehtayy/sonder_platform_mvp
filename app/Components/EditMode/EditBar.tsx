"use client";
import React, { useState } from "react";
import { HelpCircle, List, ChevronDown, Plus, X } from "lucide-react";
import { 
  LineChart, 
  Circle, 
  Axis3D, 
  ListChecks, 
  Sliders,
  PencilLine,
} from 'lucide-react';
import { useStore, addQuestionEditor, addMCQuestionEditor } from "@/app/store";
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

export interface Option {
  id: number;
  label: string;
}

// interface ButtonItem {
//   name: string;
//   icon: React.ElementType;
// }

export interface ObjectType {
  name: string;
  type: PopUpType;
  icon: React.ElementType;
}

export const EditBar: React.FC = () => {
  const [selectedObjectType, setSelectedObjectType] =
    useState<ObjectType | null>(null);



const controlTypes: ObjectType[] = [
  { name: "SliderControl", type: SliderControlAdvanced, icon: Sliders },
  {name: "Number Input", type: InputNumber, icon: List},
  {name: "Select Input", type: SelectControl, icon: List},
  {name: "Object Enabler", type: EnablerControl, icon: List},
]
  
const objectTypes: ObjectType[] = [
  { name: "Line Object", type: LineObj, icon: PencilLine},
  { name: "Geom Object", type: geomobj, icon: Circle },
  { name: "Function Object", type: FunctionPlotString, icon: LineChart },
  { name: "Axis Object", type: CoordinateAxis, icon: Axis3D },
];

const questionTypes: ObjectType[] = [
  { name: "Question", type: Question, icon: HelpCircle },
  { name: "MCQ", type: MultiChoiceClass, icon: ListChecks },
  {name: "Table Question", type: TableControl, icon: HelpCircle},
];

  return (
    <>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
      <DropDownMenu
          ObjectList={controlTypes}
          setSelectedObjectType={setSelectedObjectType}
          label="Add Control"
          />
        <DropDownMenu
          ObjectList={questionTypes}
          setSelectedObjectType={setSelectedObjectType}
          label="Add Question"
        />
        <DropDownMenu
          ObjectList={objectTypes}
          setSelectedObjectType={setSelectedObjectType}
          label="Add Object"
        />
        
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Question</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {questionTypes.map((objectType) => (
              <DropdownMenuItem key={objectType.type.name} onSelect={() => setSelectedObjectType(objectType)}>
                <objectType.icon className="mr-2 h-4 w-4" />
                <span>{objectType.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Object</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {objectTypes.map((objectType) => (
              <DropdownMenuItem 
                key={objectType.type.name} 
                onSelect={() => setSelectedObjectType(objectType)}
              >
                <objectType.icon className="mr-2 h-4 w-4" />
                <span>{objectType.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}
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
