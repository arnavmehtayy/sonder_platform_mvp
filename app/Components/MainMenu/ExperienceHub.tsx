"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { initDataSets } from "@/classes/init_datasets";
import { ChevronRight, Activity, Eye } from 'lucide-react';

const ExperienceCard = ({ name, slides, index }: { name: string; slides: string[]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="h-full"
    >
      <Link href={`/experience/${index + 1}`} className="block h-full">
        <div
          className="bg-white rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="bg-gradient-to-r from-[#01A9B2] to-[#7AE5EC] text-white p-6">
            <h3 className="text-2xl font-bold mb-2">{name}</h3>
            <div className="flex items-center text-sm">
              <Eye size={16} className="mr-2" />
              <span>{slides.length} visualizations</span>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">Explore interactive 3D models and simulations.</p>
            <div className="flex justify-between items-center">
              <span className="text-[#257276] font-semibold flex items-center">
                Start Experience
                <ChevronRight size={20} className={`ml-1 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </span>
              <Activity size={24} className="text-[#18D9E4]" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ExperienceHub = () => {
  const experiences = Object.entries(initDataSets).map(([key, value], index) => ({
    name: `Experience ${index + 1}`,
    slides: value.controlData.map(control => control.id.toString()),
    key
  }));
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-800 to-neutral-800 overflow-auto">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-center text-white mb-4"
        >
          Interactive Experiences
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-center text-white mb-12"
        >
          Dive into a world of 3D visualizations and simulations
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={experience.key}
              name={experience.name}
              slides={experience.slides}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ExperienceHub;