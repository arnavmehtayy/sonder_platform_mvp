"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Logo from "@/images/Sonder logo with text.png";
import { ExperienceCard } from "./ExperienceHub";

interface Experience {
  id: number;
  desc: string;
  title: string;
  user_id: number;
}

export const ExpDBHub = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('/api/experiences');
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
              <ExperienceCard
                key={experience.id}
                name={experience.title}
                slides = {[]}
                description={experience.desc}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
  
  