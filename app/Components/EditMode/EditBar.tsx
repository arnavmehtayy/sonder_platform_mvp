"use client";
import React, { useState } from "react";
import { HelpCircle, List, ChevronDown, Plus, Trash2 } from "lucide-react";
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

export interface Option {
  id: number;
  label: string;
}

export interface ObjectType {
  name: string;
  type: PopUpType;
  icon: React.ElementType;
}



const SortableItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <li ref={setNodeRef} style={style} className="flex items-center bg-gray-100 p-2 rounded">
      <div {...attributes} {...listeners} className="cursor-move mr-2">
        <GripVertical size={20} />
      </div>
      {children}
    </li>
  );
};

export const EditBar: React.FC = () => {
  const [selectedObjectType, setSelectedObjectType] = useState<ObjectType | null>(null);



  const controlTypes: ObjectType[] = [
    { name: "SliderControl", type: SliderControlAdvanced, icon: Sliders },
    {name: "Object Picker", type: SelectControl, icon: List},
    {name: "Hide/Show Object", type: EnablerControl, icon: ToggleLeft},
    {name: "Object Placer", type: Placement, icon: MousePointerClick},
    {name: "Score", type: FunctionScore, icon: Calculator},
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

  const getName = useStore(getSideBarName)

  const order = useStore((state) => state.order);
  const setOrder = useStore((state) => state.setOrder);
  const deleteOrderItem = useStore((state) => state.deleteOrderItem);
  const deleteVizObj = useStore((state) => state.deleteVizObj);
  const vizobjs = useStore((state) => state.vizobjs);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const {active, over} = event;

    if (active.id !== over.id) {
      const oldIndex = order.findIndex((item) => `${item.type}-${item.id}` === active.id);
      const newIndex = order.findIndex((item) => `${item.type}-${item.id}` === over.id);
      
      const newOrder = [...order];
      const [reorderedItem] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, reorderedItem);

      setOrder(newOrder);
    }
  };

  const handleDeleteItem = (id: number, type: string) => {
    deleteOrderItem(id, type);
    if (type === 'control' || type === 'placement' || type === 'question') {
      deleteVizObj(id);
    }
  };

  return (
    <>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
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

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center space-x-2">
              <List className="h-5 w-5" />
              <span>Manage Sidebar</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Manage Order and Objects</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={order.map(item => `${item.type}-${item.id}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <ul className="space-y-2">
                    {order.map((item) => (
                      <SortableItem key={`${item.type}-${item.id}`} id={`${item.type}-${item.id}`}>
                      <div className="flex-grow">{getName(item)}</div>
                      <button
                        onClick={() => handleDeleteItem(item.id, item.type)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </SortableItem>
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Scene Objects</h3>
              <ul className="space-y-2">
                {Object.entries(vizobjs).map(([id, obj]) => (
                  <li key={id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span>{`${obj.name}`}</span>
                    <button
                      onClick={() => deleteVizObj(Number(id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
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