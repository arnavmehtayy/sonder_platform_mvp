"use client";
import React, { useState, useEffect } from "react";
import {Minigame} from "./Components/Minigame";
import ExperienceManager from "./Components/ExperienceManager"
import { preventZoom } from "./preventZoom";
import ExperienceHub from '@/app/Components/MainMenu/ExperienceHub'



export default function Home() {
  useEffect(() => {
    preventZoom();
  }, []);
  // document.body.style.overflow= "hidden"
  return (
    <main className="overflow-y-auto">
      <ExperienceHub />
    </main>
  );
   
}
