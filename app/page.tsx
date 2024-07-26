"use client";
import React, { useState, useEffect } from "react";
import {Minigame} from "./Components/Minigame";
import "./styles.css";
import ExperienceManager from "./Components/ExperienceManager"
import { preventZoom } from "./preventZoom";



export default function Home() {
  useEffect(() => {
    preventZoom();
  }, []);
  // document.body.style.overflow= "hidden"
  return (
    <main>
      <ExperienceManager />
    </main>
  );
}
