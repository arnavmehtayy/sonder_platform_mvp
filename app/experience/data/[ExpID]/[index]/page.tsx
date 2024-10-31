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



const handleLoadState = async (experienceId: number, index: number) => {
  try {
    const response = await fetch(`/api/supabase/DataBaseAPI?experienceId=${experienceId}&index=${index}`);
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

export default function ExperiencePage() {
    const params = useParams();
    const index = Number(params.index)
    const experienceId = Number(params.ExpID)
    handleLoadState(experienceId, index)


    return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow">
        <CurvedBackButton />
        <MinigameDB experienceID={experienceId} index={index}/>
        <FeedbackComponent />
      </div>
    </div>
    
  );

    
  
  
  
   
  
    // if (!experience || experience.slides.length <= Number(slideIndex)) { // if the viztool is not found
      
    //   return <div>Experience not found</div>; 
    // } 
    // return (
    //   <div className="flex flex-col h-screen">
    //     <div className="flex-grow">
    //       <CurvedBackButton />
    //       <Minigame 
    //         experienceId={experienceId}
    //         currentSlideIndex={Number(slideIndex)}
    //       />
    //       <FeedbackComponent />
    //     </div>
    //   </div>
      
    // );
  }