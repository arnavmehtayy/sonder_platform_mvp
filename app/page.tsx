"use client";
import React, { useState, useEffect } from "react";
import { Minigame } from "@/app/Components/Sidebar/Minigame";
import ExperienceHub from "@/app/Components/MainMenu/ExperienceHub";
import { Analytics } from '@vercel/analytics/react';
import Link from "next/link";
import { createClient } from "@/app/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { preventZoom } from "@/app/preventZoom";
import { ExpDBHub } from "@/app/Components/MainMenu/ExpDBHub";

/*
  * This is the main page of the application
  * It is responsible for rendering the ExperienceHub
*/

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    preventZoom();
    
    // Check if user is logged in
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsAuthenticated(!!user);
    };
    getUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setIsAuthenticated(false);
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
      <ExpDBHub isAuthenticated={isAuthenticated} />
      <Analytics />
    </main>
  );
}
