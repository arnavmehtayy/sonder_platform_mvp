"use client";
import React, { useState, useEffect } from "react";
import { Minigame } from "../Components/Sidebar/Minigame";
import ExperienceHub from "@/app/Components/MainMenu/ExperienceHub";
import { Analytics } from '@vercel/analytics/react';
import Link from "next/link";
import { createClient } from "../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { preventZoom } from "../preventZoom";
import { ExpDBHub } from "../Components/MainMenu/ExpDBHub";

/*
  * This is the main page of the application
  * It is responsible for rendering the ExperienceHub
*/

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    preventZoom();
    
    // Check if user is logged in
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
    }
  };

  return (
    <main>
      <style>{`body, html { touch-action: auto;
    overflow-y: scroll;
    overflow: auto;
    height: 100%;
    width: 100%; }`}</style> 


      <div className="fixed top-4 right-4 z-50">
        {user ? (
          <button 
            onClick={handleSignOut}
            className="px-6 py-2 bg-[#01A9B2] text-white rounded-lg shadow-lg hover:opacity-90 transition-opacity"
          >
            Sign Out {user.email}
          </button>
        ) : (
          <Link href="/login">
            <button className="px-6 py-2 bg-[#01A9B2] text-white rounded-lg shadow-lg hover:opacity-90 transition-opacity">
              Login
            </button>
          </Link>
        )}
      </div>
      <ExpDBHub />
      <Analytics />
    </main>
  );
}
