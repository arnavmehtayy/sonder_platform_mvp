"use client";
import React, { useState, useEffect } from "react";
import { Minigame } from "./Components/Sidebar/Minigame";
import { preventZoom } from "./preventZoom";
import ExperienceHub from "@/app/Components/MainMenu/ExperienceHub";
import { Analytics } from '@vercel/analytics/react';

/*
  * This is the main page of the application
  * It is responsible for rendering the ExperienceHub
*/

export default function Home() {
  useEffect(() => {
    preventZoom();
  }, []);
  // document.body.style.overflow= "hidden"
  return (
    <main>
      <style>{`body, html { touch-action: auto;
    overflow-y: scroll;
    overflow: auto;
    height: 100%;
  width: 100%; }`}</style> 


      <ExperienceHub />
      <Analytics />
    </main>
  );
}
