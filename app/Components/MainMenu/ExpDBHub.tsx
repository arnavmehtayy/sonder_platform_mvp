"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Logo from "@/images/Sonder logo with text.png";
import { ExperienceCard } from "./ExperienceHub";
import { ChevronRight, Activity, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

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

export const ExpDBHub = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchExperiences();
  }, []);

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