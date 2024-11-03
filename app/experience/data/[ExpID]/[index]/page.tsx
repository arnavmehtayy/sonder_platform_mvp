'use client'
import { Minigame } from '@/app/Components/Sidebar/Minigame';
import { experiences } from "@/classes/Data/CompleteData";
import CurvedBackButton from '@/app/Components/three/BackButton';
import { useParams } from 'next/navigation';
import { FeedbackComponent } from '@/app/Components/MainMenu/FeedbackComponent';
import '@/app/TutorialOverlay.css';  
import { deserializeState } from '@/classes/database/stateSerializer';
import { useStore } from '@/app/store';
import { MinigameDB } from '@/app/Components/Sidebar/MinigameDB';
import { useEffect } from 'react';

const resetState = () => {
  useStore.setState({
    order: [],
    vizobjs: {},
    title: "",
    questions: {},
    controls: {},
    placement: {},
    scores: {},
    validations: [],
    influenceAdvIndex: {},
  });
};

const handleLoadState = async (experienceId: number, index: number) => {
  resetState(); // Reset before loading new state
  
  try {
    const response = await fetch(`/api/supabase/DataBaseAPI?experienceId=${experienceId}&index=${index}`);
    if (!response.ok) {
      throw new Error('Failed to load state');
    }
    const serializedState = await response.json();
    const loadedState = deserializeState(serializedState);
    useStore.setState(loadedState);
  } catch (error) {
    console.error('Error loading state:', error);
  }
};

export default function ExperiencePage() {
  const params = useParams();
  
  useEffect(() => {
    const index = Number(params.index);
    const experienceId = Number(params.ExpID);
    handleLoadState(experienceId, index);

    // Cleanup function to reset state when leaving the page
    return () => {
      resetState();
    };
  }, [params]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow">
        <CurvedBackButton />
        <MinigameDB experienceID={Number(params.ExpID)} index={Number(params.index)}/>
        <FeedbackComponent />
      </div>
    </div>
  );
}