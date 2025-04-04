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
  getAdvancedInfluencesSelector,
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
import { createClient } from "@/app/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { SceneManager } from "./SceneManager";

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
  const router = useRouter();
  const reset = useStore((state) => state.reset);
  const state_name = useStore(getStateName);
  const [stateData, setStateData] = useState({
    name: "",
    title: "",
    description: "",
    profileId: null as number | null,
    experienceId: 0,
    index: 0,
  });
  const placement = useStore(getPlacementListSelector);
  const updateValidation = useStore(UpdateValidationSelector);
  const validationInstance = useStore((state) => state.validations);

  const [showValidation, setShowValidation] = useState(true);
  const [allValidationsValid, setAllValidationsValid] = useState(false);
  const order = useStore((state) => state.order);
  const setOrder = useStore((state) => state.setOrder);
  const deleteOrderItem = useStore((state) => state.deleteOrderItem);
  const deleteVizObj = useStore((state) => state.deleteVizObj);
  const deleteQuestion = useStore((state) => state.deleteQuestion);
  const deletePlacement = useStore((state) => state.deletePlacement);
  const deleteScore = useStore((state) => state.deleteScore); 
  const vizobjs = useStore((state) => state.vizobjs);
  const getName = useStore(getSideBarName);
  const validationDescriptions = useStore(getValidationDescription);
  const validationDeletor = useStore(deleteValidationByIndexSelect)
  const advancedInfluences = useStore(getAdvancedInfluencesSelector);
  const deleteAdvancedInfluence = useStore((state) => state.deleteInfluenceAdv);

  useEffect(() => reset("default"), []);

  useEffect(() => {
    const checkAllValidations = () => {
      const allValid = validationInstance.every((validation) => validation.get_isValid());
      setAllValidationsValid(allValid);
    };
    checkAllValidations();
  }, [validationInstance]);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('No user found:', userError);
          return;
        }

        // Fetch profile using the user ID
        const response = await fetch(`/api/supabase/profile?userId=${user.id}`);
        if (response.ok) {
          const profile = await response.json();
          setStateData(prev => ({ ...prev, profileId: profile.id }));
        } else {
          console.error('Error fetching profile');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserAndProfile();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = await createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.push('/login');
        return;
      }
    };

    checkAuth();
  }, [router]);

  const handleValidationUpdate = () => {
    updateValidation();
  };

  const handleSaveState = async () => {
    try {
      const supabase = await createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast.error("Please log in to save your state");
        return;
      }

      if (!stateData.profileId) {
        toast.error("Unable to find user profile");
        return;
      }

      const serializedState = serializeState(useStore.getState());
      const response = await fetch('/api/supabase/DataBaseAPI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          exp_title: stateData.name, 
          exp_desc: stateData.description, 
          stateName: stateData.name, 
          state: serializedState,
          profileId: stateData.profileId,
          experienceId: stateData.experienceId,
          index: stateData.index
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save state');
      }
      
      toast.success('State saved successfully');
    } catch (error) {
      console.error('Error saving state:', error);
      toast.error('Failed to save state');
    }
  };
  
  const handleLoadState = async () => {
    try {
      const response = await fetch(`/api/supabase/DataBaseAPI?experienceId=${stateData.experienceId}&index=${stateData.index}`);
      if (!response.ok) {
        throw new Error('Failed to load state');
      }
      const serializedState = await response.json();
      const loadedState = deserializeState(serializedState);
      
      useStore.setState(loadedState);
      toast.success('State loaded successfully');
    } catch (error) {
      console.error('Error loading state:', error);
      toast.error('Failed to load state');
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
    if (type === 'control') {
      deleteVizObj(id);
    }
    if (type === 'question') {
      deleteQuestion(id);
    }
    if (type === 'placement') {
      deletePlacement(id);
    }
    if (type === 'score') {
      deleteScore(id);
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
          <SceneManager
            sensors={sensors}
            handleDragEnd={handleDragEnd}
            handleDeleteItem={handleDeleteItem}
          />
        </Dialog>

        <OrderHandler state_name={state_name} />

        <br />
        <br />
        <br />

        {/* Add state management */}
        {/* <Dialog>
          <DialogTrigger asChild>
            <button className="mt-4 p-4 bg-white rounded shadow w-full">
              State Management
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>State Management</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">State Name</label>
                <input
                  type="text"
                  value={stateData.name}
                  onChange={(e) => setStateData({...stateData, name: e.target.value})}
                  placeholder="Enter state name"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={stateData.title}
                  onChange={(e) => setStateData({...stateData, title: e.target.value})}
                  placeholder="Enter title"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={stateData.description}
                  onChange={(e) => setStateData({...stateData, description: e.target.value})}
                  placeholder="Enter description"
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Experience ID</label>
                <input
                  type="number"
                  value={stateData.experienceId}
                  onChange={(e) => setStateData({...stateData, experienceId: parseInt(e.target.value) || 0})}
                  placeholder="Enter experience ID"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Index</label>
                <input
                  type="number"
                  value={stateData.index}
                  onChange={(e) => setStateData({...stateData, index: parseInt(e.target.value) || 0})}
                  placeholder="Enter index"
                  className="w-full p-2 border rounded"
                />
              </div>
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
          </DialogContent>
        </Dialog> */}
      </div>
    </div>
  );
}
