"use client";
import React, { useState, useEffect } from "react";
import { Minigame } from "./Components/Minigame";
import ExperienceManager from "./Components/ExperienceManager";
import { preventZoom } from "./preventZoom";
import ExperienceHub from "@/app/Components/MainMenu/ExperienceHub";
import { Analytics } from '@vercel/analytics/react';


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
