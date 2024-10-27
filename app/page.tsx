"use client";
import React, { useState, useEffect } from "react";
import { Minigame } from "./Components/Sidebar/Minigame";
import { preventZoom } from "./preventZoom";
import ExperienceHub from "@/app/Components/MainMenu/ExperienceHub";
import { Analytics } from '@vercel/analytics/react';
import Link from "next/link";

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


      <Link href="/login" className="fixed top-4 right-4 z-50">
        <button className="px-6 py-2 bg-[#01A9B2] text-white rounded-lg shadow-lg hover:opacity-90 transition-opacity">
          Login
        </button>
      </Link>
      <ExperienceHub />
      <Analytics />
    </main>
  );
}
