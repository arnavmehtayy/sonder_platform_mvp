'use client'

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Minigame } from '@/app/Components/Sidebar/Minigame';
import { experiences } from "@/classes/Data/CompleteData";
import CurvedBackButton from '@/app/Components/three/BackButton';
import { useParams } from 'next/navigation';
import { FeedbackComponent } from '@/app/Components/MainMenu/FeedbackComponent';
import '@/app/TutorialOverlay.css';  // Add this import statement
import { TutorialOverlay } from '@/app/Components/MainMenu/TutorialOverlay';

export default function ExperiencePage() {
  const params = useParams();
  const id = params.id as string;
  const slideIndex = params.slideIndex as string;


  const experienceId = Number(id);
  const experience = experiences[experienceId];

 

  if (!experience || experience.slides.length <= Number(slideIndex)) {
    
    return <div>Experience not found</div>;
  }

  const currentSlideKey = experience.slides[Number(slideIndex)];

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
      {/* {Number(slideIndex) == 0 && <TutorialOverlay onComplete={() => 1 + 1} />} */}
    </div>
    
  );
}