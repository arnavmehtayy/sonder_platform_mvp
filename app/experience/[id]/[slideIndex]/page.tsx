'use client'
import { Minigame } from '@/app/Components/Sidebar/Minigame';
import { experiences } from "@/classes/Data/CompleteData";
import CurvedBackButton from '@/app/Components/three/BackButton';
import { useParams } from 'next/navigation';
import { FeedbackComponent } from '@/app/Components/MainMenu/FeedbackComponent';
import '@/app/TutorialOverlay.css';  


/*
  * This is the page where a slide of an experience is displayed
  * It is responsible for rendering the interactive visual along with the back buttoon and the feedback component
*/

export default function ExperiencePage() {
  const params = useParams();
  // get the id and index of experience and slide
  const id = params.id as string;
  const slideIndex = params.slideIndex as string; 


  const experienceId = Number(id);
  const experience = experiences[experienceId];

 

  if (!experience || experience.slides.length <= Number(slideIndex)) { // if the viztool is not found
    
    return <div>Experience not found</div>; 
  } 
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow">
        <CurvedBackButton />
        <Minigame 
          experienceId={experienceId}
          currentSlideIndex={Number(slideIndex)}
        />
        <FeedbackComponent />
      </div>
    </div>
    
  );
}