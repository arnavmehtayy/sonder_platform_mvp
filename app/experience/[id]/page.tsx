"use client";
import React, { useState } from 'react';
import { Minigame } from '@/app/Components/Minigame';
import { initDataSets } from "@/classes/init_datasets";
import Link from 'next/link';
import CurvedBackButton from '@/app/Components/BackButton';

export default function ExperiencePage({ params }: { params: { id: string } }) {
  const experienceIndex = parseInt(params.id, 10) - 1;
  const experienceKey = Object.keys(initDataSets)[experienceIndex];
  const experience = initDataSets[experienceKey as keyof typeof initDataSets];
  const [slideIndex, setSlideIndex] = useState(0);

  if (!experience) {
    return <div>Experience not found</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0">
        <CurvedBackButton />
      </div>
      <div className="flex-grow">
        <Minigame page={experienceKey as keyof typeof initDataSets} />
      </div>
    </div>
  );
}