"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Logo from "@/images/Sonder logo with text.png";
import { ExperienceCard } from "./ExperienceHub";
import { ChevronRight, Activity, Eye, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { createClient } from '@/app/utils/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Experience {
  id: number;
  desc: string;
  title: string;
  firstName: string;
  lastName: string;
}

interface State {
  id: number;
  state_name: string;
  index: number;
}

export const ExpDBHub = ({ isAuthenticated: parentIsAuthenticated }: { isAuthenticated: boolean }) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [newExperience, setNewExperience] = useState({ title: '', desc: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(parentIsAuthenticated);
    if (!parentIsAuthenticated) {
      setUserId(null);
    }
  }, [parentIsAuthenticated]);

  useEffect(() => {
    checkAuth();
    fetchExperiences();
  }, []);

  const checkAuth = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (session?.user) {
      setIsAuthenticated(true);
      // Fetch user profile to get userId
      const response = await fetch(`/api/supabase/profile?userId=${session.user.id}`);
      const profile = await response.json();
      setUserId(profile.id);
    }
  };

  const handleCreateExperience = async () => {
    if (!userId) return;

    try {
      const response = await fetch('/api/supabase/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newExperience.title,
          desc: newExperience.desc,
          profileId: userId,
        }),
      });

      const experience = await response.json();
      
      if (response.ok) {
        // Redirect to the new experience
        router.push(`/experience/edit/${experience.id}/0`);
      } else {
        throw new Error(experience.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create experience');
    }
  };

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/supabase/experiences');
      if (!response.ok) {
        throw new Error('Failed to fetch experiences');
      }
      const data = await response.json();
      setExperiences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-800 to-neutral-800 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <Image
            src={Logo}
            alt="Company Logo"
            width={217}
            height={60}
            className="mx-auto"
            priority
          />
        </div>
        <div className="py-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-center text-white mb-4"
          >
            A Visual Interactive Experience
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-center text-white mb-12"
          >
            Change the way you engage with educational content
          </motion.p>

          {loading && (
            <div className="text-center text-white">Loading experiences...</div>
          )}

          {error && (
            <div className="text-center text-red-500">Error: {error}</div>
          )}

          {/* <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Experiences</h2>
          </div> */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {experiences.map((experience, index) => (
              <ExperienceCardDB
                key={experience.id}
                name={experience.title}
                description={experience.desc}
                experienceId={experience.id}
                firstName={experience.firstName}
                lastName={experience.lastName}
              />
            ))}
            {isAuthenticated && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-full"
                  >
                    <div className="border-2 border-dashed border-[#01A9B2] bg-white/5 rounded-lg overflow-hidden h-full transition-all duration-300 hover:bg-white/10 cursor-pointer flex flex-col items-center justify-center min-h-[300px] group">
                      <PlusCircle size={40} className="text-[#01A9B2]/70 group-hover:text-[#01A9B2] transition-colors duration-300 mb-3" />
                      <p className="text-[#01A9B2]/70 group-hover:text-[#01A9B2] text-lg font-medium transition-colors duration-300">Add New Experience</p>
                    </div>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">Create New Experience</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter experience title"
                        className="mt-1"
                        value={newExperience.title}
                        onChange={(e) => setNewExperience(prev => ({...prev, title: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="What is this experience about?"
                        className="mt-1"
                        value={newExperience.desc}
                        onChange={(e) => setNewExperience(prev => ({...prev, desc: e.target.value}))}
                      />
                    </div>
                    <Button 
                      onClick={handleCreateExperience}
                      className="w-full bg-[#01A9B2] hover:bg-[#018A91] transition-colors duration-300"
                    >
                      Create Experience
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};


export const ExperienceCardDB = ({
  name,
  description,
  experienceId,
  firstName,
  lastName
}: {
  name: string;
  description: string;
  experienceId: number;
  firstName: string;
  lastName: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();


  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/experience/data/${experienceId}/${0}`);
    
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="h-full"
    >
      <div
        onClick={handleClick}
        className="bg-white rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="bg-gradient-to-r from-[#01A9B2] to-[#7AE5EC] text-white p-6"
        >
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
          <div className="flex items-center text-sm">
            <User size={16} className="mr-2" />
            <span>Created by {firstName} {lastName}</span>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="flex justify-between items-center">
            <span className="text-[#257276] font-semibold flex items-center">
              Start Experience
              <ChevronRight
                size={20}
                className={`ml-1 transition-transform duration-300 ${
                  isHovered ? "translate-x-1" : ""
                }`}
              />
              {/* traslate arrow forward when hovering as user feedback to click to go to experience */}
            </span>
            <Activity size={24} className="text-[#18D9E4]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};