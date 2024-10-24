"use client";
import React, { useEffect, useState } from "react";
import Experience from "../visualexp";
import {
  useStore,
  getStateName,
  getPlacementListSelector,
  State,
  UpdateValidationSelector,
  getSideBarName,
  getValidationDescription,
  deleteValidationByIndexSelect,
} from "@/app/store";
import "katex/dist/katex.min.css";
import "../style.css";
import ValidationComponent from "../ShowValid";
import { OrderHandler } from "./OrderHandler";
import { CheckCircle } from 'lucide-react';
import { serializeState, deserializeState } from "@/classes/database/stateSerializer";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

export function MinigameEdit({}: {}) {
  const reset = useStore((state) => state.reset);
  const state_name = useStore(getStateName);
  const placement = useStore(getPlacementListSelector);
  const updateValidation = useStore(UpdateValidationSelector);
  const validationInstance = useStore((state) => state.validations);
  const [stateName, setStateName] = useState("");
  const [showValidation, setShowValidation] = useState(true);
  const [allValidationsValid, setAllValidationsValid] = useState(false);
  const order = useStore((state) => state.order);
  const setOrder = useStore((state) => state.setOrder);
  const deleteOrderItem = useStore((state) => state.deleteOrderItem);
  const deleteVizObj = useStore((state) => state.deleteVizObj);
  const vizobjs = useStore((state) => state.vizobjs);
  const getName = useStore(getSideBarName);
  const validationDescriptions = useStore(getValidationDescription);
  const validationDeletor = useStore(deleteValidationByIndexSelect)

  useEffect(() => reset("default"), []);

  const handleValidationUpdate = () => {
    updateValidation();
  };

  useEffect(() => {
    const checkAllValidations = () => {
      const allValid = validationInstance.every((validation) => validation.get_isValid());
      setAllValidationsValid(allValid);
    };
    checkAllValidations();
  }, [validationInstance]);

  const handleSaveState = async () => {
    try {
      const serializedState = serializeState(useStore.getState());
      console.log(serializedState)
      const response = await fetch('/api/supabase/DataBaseAPI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stateName, state: serializedState }),
      });
      if (!response.ok) {
        throw new Error('Failed to save state');
      }
      console.log('State saved successfully');
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };
  
  const handleLoadState = async () => {
    try {
      const response = await fetch(`/api/supabase/DataBaseAPI?stateName=${stateName}`);
      if (!response.ok) {
        throw new Error('Failed to load state');
      }
      const serializedState = await response.json();
      const loadedState = deserializeState(serializedState);
      console.log(loadedState)
      
      useStore.setState(loadedState);
      console.log(useStore.getState().controls)
      console.log('State loaded successfully');
    } catch (error) {
      console.error('Error loading state:', error);
    }
  };

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
    <div className="relative flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Main Three.js Experience */}
      <div className="flex-grow bg-black h-1/2 md:h-full md:flex-1">
        <Experience />
      </div>

      {/* Floating Validation Button */}
      <button
        onClick={() => setShowValidation(!showValidation)}
        className={`absolute bottom-4 left-4 flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300 z-10 ${
          allValidationsValid ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {allValidationsValid && <CheckCircle className="text-white" size={20} />}
        <span className="text-white font-semibold">
          {showValidation ? 'Hide' : 'Show'} Grader
        </span>
      </button>

      {/* Validation Overlay */}
      <div
        className={`absolute bottom-16 left-4 w-80 bg-white bg-opacity-90 rounded-lg shadow-xl p-4 transition-all duration-300 ${
          showValidation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
        } z-20`}
      >
        <ValidationComponent
          validations={validationInstance}
          updater={handleValidationUpdate}
        />
      </div>

      {/* Sidebar */}
      <div
        className="w-full md:w-1/3 md:min-w-[300px] md:max-w-md bg-blue-50 p-4 overflow-y-auto h-1/2 md:h-full relative"
        style={{ height: "100lvh" }}
      >
        <Dialog>
          <DialogTrigger asChild>
            <button className="absolute top-3 right-3 flex items-center gap-2 px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-md z-10">
              <GripVertical size={18} />
              <span className="text-sm font-medium">Scene Manager</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Sidebar Manager</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={order.map(item => `${item.type}-${item.id}`)} strategy={verticalListSortingStrategy}>
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
              <h3 className="text-lg font-semibold mb-2">Visual Objects Manager</h3>
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
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Validation Manager</h3>
              <ul className="space-y-2">
                {validationInstance.map((validation, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span>{validationDescriptions(validation)}</span>
                    <button
                      onClick={() => validationDeletor(index)}
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

        <OrderHandler state_name={state_name} />

        <br />
        <br />
        <br />

        <div className="mt-4 p-4 bg-white rounded shadow">
          <h3 className="text-lg font-semibold mb-2">State Management</h3>
          <input
            type="text"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            placeholder="Enter state name"
            className="w-full p-2 border rounded mb-2"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSaveState}
              className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              Save State
            </button>
            <button
              onClick={handleLoadState}
              className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
            >
              Load State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
