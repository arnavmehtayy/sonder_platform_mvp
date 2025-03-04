"use client";
import React, { useState, useEffect } from "react";
import { Minigame } from "@/app/Components/Sidebar/Minigame";
import ExperienceHub from "@/app/Components/MainMenu/ExperienceHub";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import { createClient } from "@/app/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { preventZoom } from "@/app/preventZoom";
import { ExpDBHub } from "@/app/Components/MainMenu/ExpDBHub";
import { UserCircle, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsAuthenticated(!!user);
    };
    getUser();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#01A9B2] text-white hover:opacity-90 transition-opacity">
                <UserCircle size={24} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium text-gray-500">
                {user.email}
              </div>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
