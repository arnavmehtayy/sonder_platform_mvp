'use client'

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Minigame } from '@/app/Components/Minigame';
import { experiences } from "@/classes/Data/CompleteData";
import CurvedBackButton from '@/app/Components/BackButton';
import { useParams } from 'next/navigation';
import { FeedbackComponent } from '@/app/Components/MainMenu/FeedbackComponent';

export default function ExperiencePage() {
  const params = useParams();
  const id = params.id as string;
  const slideIndex = params.slideIndex as string;


  const experienceId = Number(id);
  const experience = experiences[experienceId - 1];



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
    </div>
  );
}